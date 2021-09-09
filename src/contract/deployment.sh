#!/bin/bash

tezos-client originate contract TZMINT transferring 0 from bob running "/opt/contract/TZMINT.tz" \
--init '(Pair
    (Pair
        (Pair
            (Pair 80 80)
            (Pair
                1000000000
                (Pair "2021-09-09T14:11:50Z" 1000)))
        (Pair
            (Pair "tez" 0)
            (Pair
                "TZMINT Demo"
                (Pair 1000000 "None"))))
    (Pair
        (Pair
            (Pair
                {
                    Elt "tz1hRTppkUow3wQNcj9nZ9s5snwc6sGC8QHh" 0
                }
                1000000)
            (Pair
                "tz1hRTppkUow3wQNcj9nZ9s5snwc6sGC8QHh"
                (Pair 0 1000000)))
        (Pair
            (Pair
                1000
                (Pair
                    500
                    {
                        "Sale";
                        "Bankruptcy"
                    }))
            (Pair
                4000
                (Pair 0 0)))))' \
 --fee 0.01266 \
 --gas-limit 106000 \
 --storage-limit 10000 \
 --force-low-fee