"use client"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
)

const Pay = () => {
    const [value, setValue] = useState(1);
    const searchParams = useSearchParams();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value);
        setValue(newValue);
    }

    const handleBuy = async () => {
        try {
            const stripe = await stripePromise;
            const res = await axios.post("/api/stripe", { value })
            console.log("res----------", res)
            console.log("data----------", res.data)
            const session = res.data
            if (stripe) {
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id
                })
                if (result.error) {
                    console.log("error", result.error)
                }
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <p className="mt-0 sm:mt-[10px] md:mt-[20px] p-2 text-[#FF8A00] text-[12px] sm:text-[14px] md:text-[18px] tracking-wider text-center uppercase">- UPLOAD DOCUMENT -</p>
            <h2 className="mt-0 sm:mt-[10px] md:mt-[20px] mb-7 font-bold leading-none text-center text-[28px] sm:text-[36px] md:text-[36px]">Purchase Credits</h2>
            <div className="w-[85%] xl:w-[80%] px-[10px] sm:px-[12px] xl:px-[20px] bg-[#0D6EFD] bg-opacity-15  rounded-[14px] mb-[20px]">
                <div className="flex justify-between mt-[20px]">
                    <Link href={"/freeupload"} >
                        <Image
                            src="/preview.webp"
                            alt="preview"
                            width={26}
                            height={26}
                        />
                    </Link>
                    <Link href={"/"}>
                        <Image
                            src="/cancel.webp"
                            alt="cancel"
                            width={25}
                            height={25}
                        />
                    </Link>
                </div>
                <div className="mx-[20px] md:mx-[60px] xl:mx-[100px] mb-[40px] flex flex-col items-center mt-[20px] text-[32px] text-black font-semibold">
                    <div className="text-[28px] sm:text-[36px] md:text-[42px]">Make Payment</div>
                    <div className="flex xl:flex-row flex-col w-full justify-between gap-4 h-fit mt-[50px]">
                        <div className="xl:w-1/2 w-full">
                            <div className="w-[90%]">
                                <div className="text-[16px] sm:text-[18px] md:text-[20px] font-bold ">Credit Number</div>
                                <input type="number" className="w-full h-[44px] sm:h-[48px] md:h-[56px] border border-black rounded-[8px] mt-[15px] pl-[10px]" value={value} onChange={handleChange} min={1} step={1}></input>
                            </div>
                        </div>
                        <div className="xl:w-1/2 w-full">
                            <div className="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-black ">Review payment Amount </div>
                            <div className="flex justify-around mt-[20px]">
                                <div className="text-[16px] md:text-[20px] text-black text-opacity-60">For <span className="text-black text-[18px] md:text-[18px] font-bold">{value}</span> credits</div>
                                <div className="text-[20px] md:text-[24px] text-black text-opacity-60">$0.2</div>
                            </div>
                            <div className="w-[90%] h-[3px] bg-black float-end"></div>

                            <div className="flex justify-around mt-[5px]">
                                <div className="text-[24px] md:text-[28px] text-black font-bold">Total</div>
                                <div className="text-[24px] md:text-[28px] text-black font-bold">${value / 5} USD</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-[90px]">
                        <button className="w-[280px] sm:w-[320px] md:w-[360px] h-[44px] sm:h-[70px] md:h-[78px] bg-[#665cff] rounded-2xl" onClick={handleBuy}>
                            <div className="flex justify-center gap-2 items-center mr-[5px]">
                                <Image
                                    src="/stripe.webp"
                                    alt="card"
                                    width={64}
                                    height={64}
                                    className="w-[60px] md:w-[64px] h-[60px] md:h-[64px] rounded-full"
                                />
                                <span className="text-[20px] sm:text-[24px] md:text-[28px] text-white text-bold">Pay with Stripe</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pay
