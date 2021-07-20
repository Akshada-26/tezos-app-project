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
                b=1, 
                s=1, 
                preminted = 0, 
                I = 10, 
                D = 10, 
                minimumInvestment =0,
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
            phase              = 0                                              # starting under MFG
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
    def modify_sell_slope(self):
        sp.if self.data.total_tokens != 0:
           self.data.s = 2 * sp.utils.mutez_to_nat(sp.balance) / (self.data.total_tokens * self.data.total_tokens)

    # initial phase, the price is fix
    def buy_initial(self):
        # calculate amount of tokens from sp.amount and the price
        token_amount = sp.local(
            "token_amount", 
            sp.ediv(
                sp.amount, 
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
            sp.send(self.data.organization, sp.snd(token_amount.value))

    # after initial phase, the price will increase
    def buy_slope(self):
        # calculate amount of tokens from sp.amount
        # see https://github.com/C-ORG/whitepaper#buy-calculus
        token_amount = sp.local(
            "token_amount", 
            self.square_root(
                2 * sp.utils.mutez_to_nat(sp.amount) / self.data.b + 
                self.data.total_tokens * self.data.total_tokens
                ) - self.data.total_tokens
            )

        # fail if no tokens can be issued with this amount of tez
        sp.if sp.as_nat(token_amount.value) == sp.as_nat(0):
            sp.failwith("No token can be issued, please send more tez")
            
        # if organization calls this function
        sp.if sp.sender == self.data.organization:
            # put tokens for the organization into the ledger
            self.data.ledger[self.data.organization] += sp.as_nat(token_amount.value)
            # increase total amount of the tokens
            self.data.total_tokens += sp.as_nat(token_amount.value)
            # this will keep all received tez in this contract as buyback reserve
            
        # if someone else is calling this function
        sp.else:
            
            # calculate buyback reserve from sp.amount I*sp.amount/100
            buyback_reserve = sp.local(
                "local_amount", 
                sp.utils.nat_to_mutez(self.data.I * sp.utils.mutez_to_nat(sp.amount) / 100)
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
            self.modify_sell_slope()

    # buy some tokens with sender's tez
    @sp.entry_point
    def buy(self):
        # if token in intialization phase, the price is fixed and all funds are escrowed
        sp.if sp.balance < self.data.MFG:
            self.buy_initial()
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

    # token holder can at anytime take the decision to burn its tokens            
    @sp.entry_point
    def burn(self, params):
        self.burn_intern(params.amount)
        self.modify_sell_slope()

    @sp.entry_point
    def sell_initial(self, params):
        sp.if self.data.ledger.contains(sp.sender):
        # check if the address owns enough tokens
            sp.if self.data.ledger[sp.sender] >= sp.as_nat(params.amount):
                self.burn_intern(params.amount)
                sp.send(sp.sender, sp.mul(sp.as_nat(params.amount),self.data.price))
                self.modify_sell_slope()

    @sp.entry_point
    def sell_slope(self, params):
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
                self.modify_sell_slope()

    @sp.entry_point
    def sell(self, params):
        # check if MPT is met, before that the tokens are locked
        sp.verify(sp.now >= self.data.MPT)
        # if token in intialization phase, the price is fixed and all funds are escrowed
        sp.if sp.balance < self.data.MFG:
            self.sell_initial(params)
        # if initialization phase is past
        sp.else:
            self.sell_slope(params)

        
                
    @sp.entry_point
    def pay(self):
        # see https://github.com/C-ORG/whitepaper#-revenues---pay
        buyback_reserve = sp.local(
            "local_amount", 
            sp.utils.nat_to_mutez(
                sp.utils.mutez_to_nat(sp.amount) * self.data.D / 100
                )
            )
        # send sp.amount - buyback_reserve to organization
        sp.send(self.data.organization, sp.amount - buyback_reserve.value)
        # rest will be hold in this contract as buyback reserve

        # issue tokens for the amount of buyback_reserve
        # check the phase to calculate the token amount
        sp.if sp.balance < self.data.MFG:
            token_amount = sp.local(
                "token_amount", 
                sp.ediv(
                    sp.amount, 
                    self.data.price
                    ).open_some()
                )
            # mint the amount of tokens for the organization
            self.data.ledger[self.data.organization] += sp.fst(token_amount.value)

        # if initialization phase is past
        sp.else:
            token_amount = sp.local(
                "token_amount", 
                self.square_root(
                    2 * sp.utils.mutez_to_nat(sp.amount) / self.data.b + 
                    self.data.total_tokens * self.data.total_tokens
                    ) - self.data.total_tokens
                )
            # mint the amount of tokens for the organization
            self.data.ledger[self.data.organization] += sp.as_nat(token_amount.value)
        self.modify_sell_slope()
            
@sp.add_test(name= "Initialization")
def initialization():
    
    # dummy addresses
    organization = sp.address("tz1hRTppkUow3wQNcj9nZ9s5snwc6sGC8QHh")
    buyer1 = sp.address("tz1xbuyer1")
    buyer2 = sp.address("tz1xbuyer2")

    # init with initial_price = 1 tez, MFG = 10 tez and MPT = 1 year
    contract= PEQ(
        organization = organization, 
        b = 1000000, 
        s = 500000, 
        initial_price = sp.tez(1), 
        MFG = sp.tez(10), 
        MPT = 0,
        company_valuation = 100,
        total_allocation = 1,
        stake_allocation = 1,
        termination_events = ["event1", "event2"],
        govRights = "no defined",
        company_name = "PEQ sample"
        )
    
    scenario = sp.test_scenario()
    scenario += contract
    
    # buy some tokens till reaching MFG check the price is fix
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(3))
    scenario += contract.buy().run(sender = buyer2, amount = sp.tez(5))
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(1))
    
    scenario.verify(contract.data.price == sp.tez(1))
    
    # now MFG is reached, buy more and see price increasing
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(10))
    scenario += contract.buy().run(sender = buyer2, amount = sp.tez(30))
    scenario += contract.buy().run(sender = buyer1, amount = sp.tez(20))
    
    scenario.verify(contract.data.price > sp.tez(1))

    # burn some tokens and check that the price is increasing
    scenario += contract.burn(amount=5).run(sender = buyer1)