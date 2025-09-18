import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@brother-terminal/components/ui/accordion";

const questions = [
  {
    name: "What is Brother Terminal",
    content: (
      <p>
        Brother Terminal is a professional trading terminal powered by Hyperliquid with advanced AI automation and intelligent execution. It allows users to execute sophisticated trading strategies with ease.
      </p>
    ),
  },
  {
    name: "How do I deposit and withdraw funds on Brother Terminal",
    content: (
      <p>
        You can deposit funds into your Brother Terminal account using supported cryptocurrencies which are deposited onto Hyperliquid. Withdrawals are processed to your wallet address and will arrive within 5 minutes.
      </p>
    ),
  },
  {
    name: "Is Brother Terminal available worldwide",
    content: (
      <p>
        Brother Terminal is accessible in multiple regions, but some jurisdictions may have restrictions due to regulatory policies. Please check our supported countries list to see if our services are available in your location.
      </p>
    ),
  },
  {
    name: "What security measures does Brother Terminal use to protect my account",
    content: (
      <p>
        We do not store any user funds on our platform. All funds are held by Hyperliquid. We do not have access to your private keys, we use Privy's Embedded Wallets to manage your account which you can read more about at <a href="https://docs.privy.io/guide/embedded-wallets" className="text-primary underline">https://docs.privy.io/guide/embedded-wallets</a>.
      </p>
    ),
  },
  {
    name: "What fees are collected on trades by Brother Terminal",
    content: (
      <p>
        We charge a{" "}
        <span className="underline text-primary">0.05% trading fee</span> on each executed trade, which is deducted automatically at the time of the transaction
      </p>
    ),
  },
];

export const FaqList = () => {
  return (
    <Accordion
      className="flex flex-col gap-4"
      defaultValue={[questions[0].name]}
      type="multiple"
    >
      {questions.map(({ name, content }) => (
        <AccordionItem key={name} value={name}>
          <GlowEffect />
          <AccordionTrigger>{name}</AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const GlowEffect = () => {
  return (
    <>
      <Mobile />
      <Tablet />
      <Desktop />
    </>
  );
};

const Desktop = () => {
  return (
    <svg
      className="overlay absolute inset-0 w-full h-full opacity-0 pointer-events-none transition-opacity hidden lg:block"
      viewBox="0 0 920 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_11638_37921)">
        <ellipse cx="460" cy="188" rx="160" ry="52" fill="#2FB7A5" />
      </g>
      <defs>
        <filter
          id="filter0_f_11638_37921"
          x="0"
          y="-164"
          width="920"
          height="704"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="150"
            result="effect1_foregroundBlur_11638_37921"
          />
        </filter>
      </defs>
    </svg>
  );
};

const Tablet = () => {
  return (
    <svg
      className="overlay absolute inset-0 w-full h-full opacity-0 pointer-events-none transition-opacity hidden md:block lg:hidden"
      viewBox="0 0 912 154"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_11638_39686)">
        <ellipse cx="456" cy="188" rx="160" ry="52" fill="#2FB7A5" />
      </g>
      <defs>
        <filter
          id="filter0_f_11638_39686"
          x="-4"
          y="-164"
          width="920"
          height="704"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="150"
            result="effect1_foregroundBlur_11638_39686"
          />
        </filter>
      </defs>
    </svg>
  );
};

const Mobile = () => {
  return (
    <svg
      className="overlay absolute inset-0 w-full h-full opacity-0 pointer-events-none transition-opacity md:hidden"
      viewBox="0 0 335 238"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_11638_38963)">
        <ellipse cx="168" cy="188" rx="160" ry="52" fill="#2FB7A5" />
      </g>
      <defs>
        <filter
          id="filter0_f_11638_38963"
          x="-292"
          y="-164"
          width="920"
          height="704"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="150"
            result="effect1_foregroundBlur_11638_38963"
          />
        </filter>
      </defs>
    </svg>
  );
};
