import "./css/index.css";
import IMask, { MaskedDate } from "imask";

const ccBgColor01 = document.querySelector("#bgcolor1");
const ccBgColor02 = document.querySelector("#bgcolor2");
const ccIcon = document.getElementById("ccIcon");

function setCardType(type) {
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    americanexpress: ["#E3C8FD", "#E5BBFF"],
    default: ["black", "gray"],
  };

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccIcon.setAttribute("src", `cc-${type}.svg`);
}

globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000",
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47]\d{0,13}/,
      cardtype: "americanexpress",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    );

    return foundMask;
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const button = document.querySelector("#button");
button.addEventListener("click", () => {
  alert("Cartão adcionado!")
  location.reload();
});

const form = document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
});

const inputName = document.querySelector("#card-holder");
inputName.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText =
    inputName.value.length === 0 ? "FULANO DA SILVA" : inputName.value;
});

securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = securityCode.value.length === 0 ? "123" : securityCode.value;
})

expirationDateMasked.on("accept", () => {
  const ccDate = document.querySelector(".cc-expiration .value")
  ccDate.innerText = expirationDateMasked.value.length === 0 ? "02/32" : expirationDateMasked.value
})

cardNumberMasked.on("accept", () => {
  const ccNumber = document.querySelector(".cc-number")
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType);
  ccNumber.innerText = cardNumberMasked.value.length === 0 ? "1234 5678 9012 3456" : cardNumberMasked.value;
})