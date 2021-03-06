import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Step from "./Step";
import styles from "./index.module.scss";
import { loadStripe } from "@stripe/stripe-js";
import stripeService from "../../services/stripe.service";
import RegisterButton from "../../components/UI/RegisterButton/RegisterButton"
import Input from "../../components/UI/Input/Input";
import Link from "next/link";
import authService from "../../services/auth.service";
import { useRouter } from "next/router";

const stripePromise = loadStripe("pk_test_51IYB3kKHE4A4HHrOPwry6jr7QSnFpODKJliEseS4NYAxmsuAnRfVkNgfdDcSEsMPPOqCEc5NhCGowDFhoy5D9zlu00jW1rgElH");

const Index = () => {
  const router = useRouter();
  const stepsData = {
    one: {
      image: {
        src: "https://assets.nflxext.com/ffe/siteui/acquisition/simplicity/Devices.png",
        alt: "step-1 image",
      },
      indicator: "STEP 1 OF 3",
      title: "Finish setting up your account",
      context:
        "Netflix is personalized for you. Create a password to watch on any device at any time.",
      icon: "",
      list: [],
    },
    two: {
      image: {},
      indicator: "STEP 1 OF 3",
      title: "Create a password to start your membership",
      context: "Just a few more steps and you're done! We hate paperwork, too.",
      icon: "",
      list: [],
    },
    three: {
      image: {
        src: "https://assets.nflxext.com/ffe/siteui/acquisition/simplicity/Checkmark.png",
        alt: "step-2 image",
      },
      indicator: "STEP 2 OF 3",
      title: "Choose your plan.",
      context: "",
      icon: "akar-icons:check",
      list: [
        "No commitments, cancel anytime.",
        "Everything on Netflix for one low price.",
        " Unlimited viewing on all your devices.",
      ],
    },
    four: {
      image: {
        src: "https://assets.nflxext.com/ffe/siteui/acquisition/simplicity/Checkmark.png",
        alt: "step-2 image",
      },
      indicator: "STEP 2 OF 3",
      title: "Choose the plan that’s right for you",
      context: "",
      icon: "akar-icons:check",
      list: [
        "Watch all you want. Ad-free.",
        "Recommendations just for you.",
        "Change or cancel your plan anytime.",
      ],
    },
  };

  const [account, setAccount] = useState({isAdmin: false, firstName: ""});
  const [plan, setPlan] = useState({label:"standard", price: 30});
  const [step, setStep] = useState(1);

  const handleConfirmation = async () => {
    // const token = localStorage.getItem('token');
    const payload = {
      total: 8.99,
      // count: count,
      // cart: cart
    }
    try {
      setStep(step + 1);
      const stripe = await stripePromise;
      const response = await stripeService.createSession(payload, plan);
      await stripe.redirectToCheckout({
        sessionId: response.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    console.log(`account ${account.email} ${account.password}`)
    console.log(step);
  },[account, step])

  const handleEmailChange = (event) => {
    //console.log({handleEmailChange});
    setAccount({ ...account, email: event.target.value })
  };

  const handlePasswordChange = (event) => {
    setAccount({ ...account, password: event.target.value })
  };

  const handleregister = (e) => {
    if (account.email!=="" && account.password!=="") {
      return console.log("FUCK YOU");
    }
      console.log(step)
      setStep(step + 1);
      console.log(step)
    

  }

  const handleSubmit = (e) => {
    console.log(account);
    e.preventDefault();
    authService
      .addAdminUser(account)
      .then((data) => {
        localStorage.setItem("token", JSON.stringify(data.token));
        console.log(data);
        router.push("/step3");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.register}>
      {step === 1 ? (
        <Step
          image={stepsData.one.image}
          indicator={stepsData.one.indicator}
          title={stepsData.one.title}   
        >
          <div className={styles.step_context}>
            Netflix is personalized for you. Create a password to watch on any
            device at any time.
          </div>
          <RegisterButton onClick={() => setStep(step + 1)} />
        </Step>
      ) : (
        <></>
      )}

      {step === 2 ? (
        <Step indicator={stepsData.two.indicator} title={stepsData.two.title}
        >
          <div className={styles.step_context}>
            Just a few more steps and you&apos;re done! We hate paperwork, too.
          </div>
          <form className={styles.register_form}>
            <Input
              type="text"
              placeholder="Email"
              name="email"
              id="email"
              autoComplete="off"
              required={true}
              // value={email}
              onChange={(e) => setAccount({ ...account, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Add a password"
              name="password"
              id="password"
              required={true}
              // value={password}
              onChange={(e) => setAccount({ ...account, password: e.target.value })}
            />
            <RegisterButton onClick={(e)=>{
              e.preventDefault()
              authService
                .register(account)
                .then((data) => {
                  localStorage.setItem("token", JSON.stringify(data.token))
                  console.log(data)
                  router.push("/step3")
                })
                .catch((err) => {
                  console.log(err)
                })
            }}/>
          </form>
        </Step>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Index;