#!/bin/bash

tezos-client originate contract TZMINT transferring 0 from bob running "/opt/contract/TZMINT.tz" \
--init '(Pair
    (Pair
        (Pair
            (Pair 80 80)
            (Pair
                1000000000
                (Pair "2021-08-20T15:22:47Z" 1300)))
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
                1)
            (Pair
                "tz1hRTppkUow3wQNcj9nZ9s5snwc6sGC8QHh"
                (Pair 0 1000000)))
        (Pair
            (Pair
                1000
                (Pair
                    50
                    {
                        "Sale";
                        "Bankruptcy"
                    }))
            (Pair
                400
                (Pair 0 0)))))' \
 --fee 0.001266 \
 --gas-limit 10600 \
 --storage-limit 496