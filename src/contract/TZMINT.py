from datetime import datetime, timedelta
import smartpy as sp

# PEQ contract sample 
# see https://github.com/C-ORG/whitepaper for the definitions

# Contract needs an organization(administrator), a minimal funding goal(MFG) in mutez
# and a minimum period of time(MPT) in years for initialization

class PEQ(sp.Contract):
    def __init__(
                self, 
                organization, 
                initial_price, 
                MFG, 
                MPT, 
                b, 
                s, 
                preminted, 
                I, 
                D, 
                minimumInvestment =sp.tez(1),
                burned_tokens = 0,
                company_valuation,
                base_currency = "tez",
                total_allocation,
                stake_allocation,
                termination_events,
                govRights,
                company_name
                ):

        self.init(
            organization  = organization,                                     # contract administrator
            ledger        = sp.map(l = {organization: sp.as_nat(preminted)}), # token ledger
            price         = initial_price,                                    # initial price before MFG
            total_tokens  = preminted,
            burned_tokens = burned_tokens,
            MFG           = MFG,                                              # minimal funding goal
            MPT           = sp.timestamp(
                                        int(
                                            (datetime.now() + timedelta(days = 365 * MPT)).timestamp()
                                        )
                                    ), # minimum period of time
            I             = I,          # percentage of the funds being held in the cash reserve
            D             = D,          # percentage of the revenues being funneled into cash reserve
            b             = b,          # buy slope
            s             = s,          # sell slope
            minimumInvestment  = minimumInvestment,
            company_v          = company_valuation,
            base_currency      = base_currency,
            total_allocation   = total_allocation,
            stake_allocation   = stake_allocation, 
            termination_events = termination_events,
            govRights          = govRights,
            company_name       = company_name,
            phase              = 0,                                              # starting under MFG
            total_investment   = sp.tez(0)
            )

    # square root for buy and sell calculus
    @sp.global_lambda
    def square_root(x):
        sp.verify(x >= 0)
        y = sp.local('y', x)
        sp.while y.value * y.value > x:
            y.value = (x // y.value + y.value) // 2
        sp.verify((y.value * y.value <= x) & (x < (y.value + 1) * (y.value + 1)))
        sp.result(y.value)

    # s calculus after each transaction
    def modify_sell_slope(self, sendback):
        sp.if self.data.total_tokens != 0:
           self.data.s = 2 * sp.utils.mutez_to_nat(sp.balance - sendback) / (self.data.total_tokens * self.data.total_tokens)

    # initial phase, the price is fix
    def buy_initial(self, amount):
        # calculate amount of tokens from sp.amount and the price
        token_amount = sp.local(
            "token_amount", 
            sp.ediv(
                amount, 
                self.data.price
                ).open_some("Fatal Error: Price is zero")
            )

        # fail if no tokens can be issued with this amount of tez
        sp.if sp.fst(token_amount.value) == sp.as_nat(0):
            sp.failwith("No token can be issued, please send more tez")
            
        # check if the address owns tokens
        sp.if self.data.ledger.contains(sp.sender):
            # add amount of the tokens into the ledger
            self.data.ledger[sp.sender] += sp.fst(token_amount.value)
        sp.else:
            # put amount of the tokens into the ledger
            self.data.ledger[sp.sender] = sp.fst(token_amount.value)
            
        # increase total amount of the tokens
        self.data.total_tokens += sp.fst(token_amount.value)

        # keep received funds in this contract as buyback reserve
        # but send back the excess
        sp.if sp.utils.mutez_to_nat(sp.snd(token_amount.value)) > 0:
            sp.send(sp.sender, sp.snd(token_amount.value))

        # track how much is invested
        self.data.total_investment = self.data.total_investment + amount - sp.snd(token_amount.value)

    # after initial phase, the price will increase
    def buy_slope(self):
        # calculate amount of tokens from sp.amount
        # see https://github.com/C-ORG/whitepaper#buy-calculus
        back_amount = sp.local(
            "back_amount",
            sp.ediv(sp.amount, self.data.b).open_some("Buy slope is 0")
            )

        # send tez that is too much
        sp.if sp.utils.mutez_to_nat(sp.snd(back_amount.value)) > 0:
            sp.send(sp.sender, sp.snd(back_amount.value))

        tez_amount = sp.local(
            "tez_amount",
            sp.amount - sp.snd(back_amount.value)
            )

        token_amount = sp.local(
            "token_amount", 
            self.square_root(
                2 * sp.utils.mutez_to_nat(sp.fst(back_amount.value)) + 
                self.data.total_tokens * self.data.total_tokens
                ) - self.data.total_tokens
            )

        # track how much is invested
        self.data.total_investment += (tez_amount.value)

        # fail if no tokens can be issued with this amount of tez
        sp.if sp.as_nat(token_amount.value) == sp.as_nat(0):
            sp.failwith("No token can be issued, please send more tez")
            
        # calculate buyback reserve from sp.amount I*sp.amount/100
        buyback_reserve = sp.local(
            "local_amount", 
            sp.utils.nat_to_mutez(self.data.I * sp.utils.mutez_to_nat(tez_amount.value)/100)
            )
            
        # send (100-I) * sp.amount/100 of the received tez to the organization
        sp.send(self.data.organization, sp.amount - buyback_reserve.value)
        # this will keep I * sp.amount/100 in this contract as buyback reserve
            
        # check if the address owns tokens
        sp.if self.data.ledger.contains(sp.sender):
            self.data.ledger[sp.sender] += sp.as_nat(token_amount.value)
        sp.else:
            self.data.ledger[sp.sender] = sp.as_nat(token_amount.value)
                 
        # increase total amount of the tokens
        self.data.total_tokens += sp.as_nat(token_amount.value)

        # set new price
        self.data.price = sp.utils.nat_to_mutez(self.data.b * self.data.total_tokens)
        self.modify_sell_slope(sp.amount - buyback_reserve.value)

    # buy some tokens with sender's tez
    @sp.entry_point
    def buy(self):
        # if token in intialization phase, the price is fixed and all funds are escrowed
        sp.if self.data.total_investment < self.data.MFG:
            sp.if sp.utils.mutez_to_nat(self.data.MFG - sp.amount - self.data.total_investment) < 0:
                sp.send(sp.sender, sp.amount - self.data.MFG + self.data.total_investment)
                self.buy_initial(self.data.MFG - self.data.total_investment)
            sp.else:
                self.buy_initial(sp.amount)
        # if initialization phase is past
        sp.else:
            self.data.phase = 1
            self.buy_slope()
           
    # internal burn function will be called by the entry points burn and sell
    def burn_intern(self, amount):
        # check if the address owns tokens
        sp.if self.data.ledger.contains(sp.sender):
            # check if the address owns enough tokens
            sp.if self.data.ledger[sp.sender] >= sp.as_nat(amount):
                # "burn"
                self.data.ledger[sp.sender] = sp.as_nat(self.data.ledger[sp.sender] - sp.as_nat(amount))
                self.data.burned_tokens += sp.as_nat(amount)

    @sp.entry_point
    def sell(self, params):
        # check that the initial phase is over
        sp.verify(self.data.phase == 1)
        # check if the address owns tokens
        sp.if self.data.ledger.contains(sp.sender):
        # check if the address owns enough tokens
            sp.if self.data.ledger[sp.sender] >= sp.as_nat(params.amount):
                # calculate the amount of tez to send
                # see https://github.com/C-ORG/whitepaper#-investments---sell
                pay_amount = sp.local(
                    "pay_amount", 
                    sp.as_nat(
                        self.data.total_tokens * sp.as_nat(params.amount) * self.data.s - 
                        sp.as_nat(params.amount * params.amount) * self.data.s / 2 
                        ) + 
                        self.data.s * sp.as_nat(params.amount) * 
                        self.data.burned_tokens * self.data.burned_tokens /
                        sp.as_nat(2 * (self.data.total_tokens - self.data.burned_tokens) )
                )
                # burn the amount of tokens selled
                self.burn_intern(params.amount)
                # send pay_amount tez to the sender of the transaction
                sp.send(sp.sender, sp.utils.nat_to_mutez(pay_amount.value))
                self.modify_sell_slope(sp.utils.nat_to_mutez(pay_amount.value))
            
@sp.add_test(name= "Initialization")
def initialization():
    
    # dummy addresses
    organization = sp.address("tz1hRTppkUow3wQNcj9nZ9s5snwc6sGC8QHh")
    buyer1 = sp.address("tz1xbuyer1")
    buyer2 = sp.address("tz1xbuyer2")

    contract= PEQ(
        organization = organization, 
        b = 2000, 
        s = 1000, 
        initial_price = sp.tez(1), 
        MFG = sp.tez(1000), 
        preminted = 0,
        MPT = 0,
        I = 80,
        D = 80, 
        company_valuation = 1000000,
        total_allocation = 4000,
        stake_allocation = 500,
        termination_events = ["Sale", "Bankruptcy"],
        govRights = "None",
        company_name = "TZMINT Demo"
        )
    
    scenario = sp.test_scenario()
    scenario += contract
    
    # buy some tokens till reaching MFG check the price is fix
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(500))
    
    # try to sell some before phase 1
    scenario += contract.sell(amount=1).run(sender = buyer1, valid=False)

    scenario += contract.buy().run(sender = buyer2, amount = sp.tez(200))
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(300))
    scenario.verify(contract.data.price == sp.tez(1))

    # now MFG is reached, buy more and see price increasing
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(50))
    scenario += contract.buy().run(sender = buyer2, amount = sp.tez(400))
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(100))
    scenario.verify(contract.data.price > sp.tez(1))
    
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(50))
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(100))
    
    # now sell some tokens
    scenario += contract.sell(amount=100).run(sender = buyer1)

    # and see how the price changes if you buy again
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(150))
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(150))
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(150))
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(50))

    # Check price for selling 1 token
    scenario += contract.sell(amount=1).run(sender = buyer1)