'use client'

import { getInvoiceDetails, getOrganizationById } from "@/lib/actions"
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Loading from "@/components/loading";
import { number2text } from "@/lib/utils";
import BillifyLogo from "@/components/logo";

export default function InvoicePreview({ params }: { params: { orgId: string, invoiceId: string } }) {
  const { orgId, invoiceId } = params
  const { data: invoice } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => await getInvoiceDetails(invoiceId)
  })
  const { data: orgData } = useQuery({
    queryKey: ['org'],
    queryFn: async () => await getOrganizationById(orgId)
  })

  if (!orgData || !invoice) return <Loading />

  const SaveAsPDFHandler = () => {
    const dom = document.getElementById('print');
    if (dom) {
      toPng(dom)
        .then((dataUrl) => {
          const img = new Image();
          img.crossOrigin = 'annoymous';
          img.src = dataUrl;
          img.onload = () => {
            // Initialize the PDF.
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'in',
              format: [8.27, 11.69], // A4 size
            });

            // Define reused data
            const imgProps = pdf.getImageProperties(img);
            const imageType = imgProps.fileType;
            const pdfWidth = pdf.internal.pageSize.getWidth();

            // Calculate the number of pages.
            const pxFullHeight = imgProps.height;
            const pxPageHeight = Math.floor((imgProps.width * 11.69) / 8.27); // Adjust for A4 size
            const nPages = Math.ceil(pxFullHeight / pxPageHeight);

            // Define pageHeight separately so it can be trimmed on the final page.
            let pageHeight = pdf.internal.pageSize.getHeight();

            // Create a one-page canvas to split up the full image.
            const pageCanvas = document.createElement('canvas');
            const pageCtx = pageCanvas.getContext('2d');
            pageCanvas.width = imgProps.width;
            pageCanvas.height = pxPageHeight;

            for (let page = 0; page < nPages; page++) {
              // Trim the final page to reduce file size.
              if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
                pageCanvas.height = pxFullHeight % pxPageHeight;
                pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
              }
              // Display the page.
              const w = pageCanvas.width;
              const h = pageCanvas.height;

              if (!pageCtx) throw new Error('Canvas context is null')

              pageCtx.fillStyle = 'white';
              pageCtx.fillRect(0, 0, w, h);
              pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

              // Add the page to the PDF.
              if (page) pdf.addPage();

              const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
              pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
            }
            // Output / Save
            pdf.save(`invoice-${invoiceId}.pdf`);
          };
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error);
        });
    }
  }

  return (

    <section className='overflow-auto flex flex-col'>
      <div className="flex justify-between mt-5">
        <Button onClick={SaveAsPDFHandler}>Save as PDF</Button>
      </div>
      <div className="flex flex-col p-4 sm:p-10 bg-white rounded-xl border text-black border-blue-500 w-[794px] h-[1123px] -z-10" id="print">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Invoice &#x23; {invoice.invoiceNo}</h1>
        <h2 className="text-2xl font-semibold">{orgData.name}</h2>
        <p className="text-sm font-semibold">GSTIN {orgData.gstno}</p>
        <p className="text-sm">{orgData.address}</p>
        <div className='flex gap-5 items-center text-sm'>
          <p className="font-semibold">
            Mobile
            <span className="font-normal ml-1">
              {orgData.companyPhone}
            </span>
          </p>
          <p className="font-semibold">
            Email
            <span className="font-normal ml-1">
              {orgData.companyEmail}
            </span>
          </p>
        </div>
        <div className="flex justify-between mt-4 text-sm">
          <p className="font-semibold">
            Invoice Date &#58;
            <span className="font-normal ml-1">
              {invoice.invDate.toLocaleDateString('en-IN')}
            </span>
          </p>
          <p className="font-semibold">
            Due Date &#58;
            <span className="font-normal ml-1">
              {invoice.dueDate.toLocaleDateString('en-IN')}
            </span>
          </p>
        </div>
        <div className="flex justify-between gap-2 mt-5 text-xs">
          <div className="w-1/3">
            <p className="font-semibold">Customer Detail&#58;</p>
            <p>{invoice.customer.name}</p>
            <p>{invoice.customer.gstno}</p>
          </div>
          <div className="w-1/3">
            <p className="font-semibold">Billing Address&#58;</p>
            <p>{invoice.customer.baddress}</p>
          </div>
          <div className="w-1/3">
            <p className="font-semibold">Shipping Address&#58;</p>
            <p>{invoice.customer.saddress}</p>
          </div>
        </div>
        <table className="mt-6 bg-blue-50 w-full text-sm">
          <thead className="text-xs bg-blue-100">
            <tr className="h-8">
              <th className="w-[20px] pl-2 text-black">&#x23;</th>
              <th className="">Item</th>
              <th className="text-right">Rate &#047; Item</th>
              <th className="w-[60px] text-right">Qty</th>
              <th className="text-right w-[110px]">Taxable Value</th>
              <th className="text-right w-[130px]">Tax Amount</th>
              <th className="text-right w-[130px] pr-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => {
              const taxableValue: number = parseFloat((item.unitPrice * item.quantity).toString());
              const taxAmount: number = parseFloat((taxableValue * (item.product.taxRate / 100)).toFixed(2));
              const amount = taxableValue + taxAmount;

              return (
                <tr key={index} className="text-xs hover:bg-blue-100 h-12">
                  <td className="text-center pl-2">{index + 1}</td>
                  <td className="pl-4">{item.product.name}</td>
                  <td className="text-right pr-2">₹ {item.unitPrice}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">₹ {taxableValue}</td>
                  <td className="text-right">₹ {taxAmount} &#40;{item.product.taxRate}%&#41;</td>
                  <td className="text-right pr-2">₹ {amount}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-white h-12">
              <td colSpan={6} className="text-left">Total</td>
              <td className="text-right pr-2">₹ {invoice.totalAmount}</td>
            </tr>
          </tfoot>
        </table>
        <div className="mt-5 text-xs w-full flex justify-end gap-2">
          <p className="font-semibold">Total amount &#40;in words&#41;&#58;</p>
          <p>{number2text(invoice.totalAmount)}</p>
        </div>
        <hr className="bg-blue-700" />
        <div className="mt-12 text-sm w-1/3">
          <p className="font-semibold mb-2">Bank Details&#58;</p>
          <div className="grid grid-cols-2">
            <p>Bank:</p>
            <span className="font-semibold"> {orgData.bankName}</span>
            <p>Account No&#58;</p>
            <span className="font-semibold"> {orgData.accountNo}</span>
            <p>IFSC Code&#58;</p>
            <span className="font-semibold"> {orgData.ifsc}</span>
            <p>Branch&#58;</p>
            <span className="font-semibold"> {orgData.bankBranch}</span>
          </div>
        </div>
        <div className="mt-auto flex justify-center items-center gap-2 h-12 bg-blue-50 rounded-lg">
          <p>Generated By&#58;</p>
          <BillifyLogo size="text-4xl" />
        </div>
      </div>
    </section>
  );
}
