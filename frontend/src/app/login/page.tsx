"use client"

import Loading from "@/components/Loading";
import { useAppData, user_service } from "@/context/AppContext";
import axios from "axios";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {

    const[email,setEmail]=useState<string>("")
    
    const[loading,setLoading]=useState<boolean>(false)
 
    const{isAuth,loading:userLoading}=useAppData

    const router=useRouter()

    const handleSubmit=async(e:React.FormEvent<HTMLElement>):Promise<void>=>{
        e.preventDefault()
        console.log('hii');
        
        setLoading(true)

        try {

            const{data}=await axios.post(`${user_service}/api/v1/login/`,{
                email
            })
            toast.success(data.message)
            router.push(`/verify?email=${email}`)
            
        } catch (error:any) {
          console.log("erroroooor",error);
          
            toast.error(error.respone?.data?.message)
        }
        finally{
            setLoading(false)
        }
    }

   if(userLoading){
    return <Loading/>
   }

   if(isAuth){
  redirect("/chat")
   }


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Mail size={50} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome To ChatApp
            </h1>
            <p className="text-gray-300 text-lg">
              Enter your email to continue journey
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="p-0">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2 m-2 "
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full px-4 m-2 py-3  bg-gray-700 border border-gray-600 rounder-lg text-white placeholder-gray-400"
                placeholder="enter your email address"
                required
              />
            
              <button
                  disabled={loading}
                type="submit"
                className="w-full bg-blue-600 text-white py-4 px-4 m-2  rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {loading?<div className="flex items-center justify-center gap-2" >
                    <Loader2 className="w-5 h-5" />
                    Sending Otp to your mail...
                  </div>: <div className="flex items-center justify-center gap-2">
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-5 h-5" />
                </div>}
               
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
