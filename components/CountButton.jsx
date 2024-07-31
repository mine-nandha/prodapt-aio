"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const CountButton = ({ children, formAction, ...props }) => {
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setCount((prev) => prev - 1), 1000);
    if (count === 0) {
      setPending(false);
    }
    return () => {
      clearInterval(timer);
    };
  }, [count]);

  async function handleClick(event) {
    event.preventDefault();
    setPending(true);
    setCount(30);
    if (formAction) {
      const formData = new FormData(event.target.closest("form"));
      await formAction(formData);
    }
  }

  return (
    <Button {...props} disabled={pending} onClick={handleClick}>
      {pending ? count : children}
    </Button>
  );
};

export default CountButton;
