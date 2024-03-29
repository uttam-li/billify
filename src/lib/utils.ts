import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function number2text(value: any) {
  var fraction = Math.round(frac(value) * 100);
  var f_text = "";

  if (fraction > 0) {
    f_text = "And " + convert_number(fraction) + " Paise";
  }

  return convert_number(value) + " Rupees " + f_text + " Only";
}

function frac(f: any) {
  return f % 1;
}

function convert_number(number: any) {
  if (number < 0 || number > 999999999) {
    return "NUMBER OUT OF RANGE!";
  }
  var Gn = Math.floor(number / 10000000); /* Crore */
  number -= Gn * 10000000;
  var kn = Math.floor(number / 100000); /* lakhs */
  number -= kn * 100000;
  var Hn = Math.floor(number / 1000); /* thousand */
  number -= Hn * 1000;
  var Dn = Math.floor(number / 100); /* Tens (deca) */
  number = number % 100; /* Ones */
  var tn = Math.floor(number / 10);
  var one = Math.floor(number % 10);
  var res = "";

  if (Gn > 0) {
    res += convert_number(Gn) + " Crore";
  }
  if (kn > 0) {
    res += (res == "" ? "" : " ") + convert_number(kn) + " Lakh";
  }
  if (Hn > 0) {
    res += (res == "" ? "" : " ") + convert_number(Hn) + " Thousand";
  }

  if (Dn) {
    res += (res == "" ? "" : " ") + convert_number(Dn) + " Hundred";
  }

  var ones = Array(
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen"
  );
  var tens = Array(
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety"
  );

  if (tn > 0 || one > 0) {
    if (!(res == "")) {
      res += " And ";
    }
    if (tn < 2) {
      res += ones[tn * 10 + one];
    } else {
      res += tens[tn];
      if (one > 0) {
        res += "-" + ones[one];
      }
    }
  }

  if (res == "") {
    res = "Zero";
  }
  return res;
}
