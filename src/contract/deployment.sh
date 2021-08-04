tezos-client originate contract TZMINT transferring 0 from bob running TZMINT.tz \
 --init '(Pair
    (Pair
        (Pair
            (Pair 10 10)
            (Pair
                10000000
                (Pair "2021-08-04T11:55:35Z" 1000000)))
        (Pair
            (Pair "tez" 0)
            (Pair
                "PEQ sample"
                (Pair 100 "no defined"))))
    (Pair
        (Pair
            (Pair
                {
                    Elt "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6" 0
                }
                0)
            (Pair
                "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6"
                (Pair 0 1000000)))
        (Pair
            (Pair
                500000
                (Pair
                    1
                    {
                        "event1";
                        "event2"
                    }))
            (Pair
                1
                (Pair 0 0)))))' \
 --fee 0.012111 \
 --gas-limit 43682 \
 --storage-limit 7611