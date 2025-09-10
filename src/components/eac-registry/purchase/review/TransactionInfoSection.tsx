import React from "react";
import { FormValues } from "../types";
import { getDeliveryDatesDisplayClass } from "../utils/deliveryDateUtils";
import { formatDate } from "@/lib/utils";
import { getCommodityUnit } from "@/utils/analytics";

interface TransactionInfoSectionProps {
  formValues: FormValues;
  eacPrice: string;
  deliveryDates: string[];
  totalPrice: number;
  pricePerDelivery: string;
  commodity: string;
}

const TransactionInfoSection: React.FC<TransactionInfoSectionProps> = ({
  formValues,
  eacPrice,
  deliveryDates,
  totalPrice,
  pricePerDelivery,
  commodity,
}) => {
  const deliveryDatesDisplayClass = getDeliveryDatesDisplayClass();

  const isSpotTransaction = formValues.transactionType === "spot";
  const isForwardTransaction = formValues.transactionType === "forward";

  // Calculate the number of deliveries
  const numberOfDeliveries = deliveryDates.length;

  // Get the appropriate unit of measure
  const unitOfMeasure = getCommodityUnit(commodity);

  console.log("eacPrice", totalPrice);

  return (
    <div className="grid grid-cols-2 gap-2 border-b pb-3">
      <p className="font-medium">Transaction Type:</p>
      <p>{isSpotTransaction ? "Spot (One-time)" : "Forward (Scheduled)"}</p>

      {isForwardTransaction && (
        <>
          <p className="font-medium">Schedule Period:</p>
          <p>
            {formValues.startDate} to {formValues.endDate}
          </p>

          <p className="font-medium">Delivery Frequency:</p>
          <p>Monthly</p>

          {formValues.dailyVolume && (
            <>
              <p className="font-medium">Daily Volume:</p>
              <p>
                {parseInt(formValues.dailyVolume).toLocaleString()}{" "}
                {unitOfMeasure}/day
              </p>
            </>
          )}

          <p className="font-medium">Gas Flow Period:</p>
          <p className="text-sm">
            Gas will flow continuously from {formValues.startDate} to{" "}
            {formValues.endDate}
          </p>

          <p className="font-medium">Token Delivery Schedule:</p>
          <div>
            <p className="text-sm">
              EACs will be delivered monthly within 60 days of the physical
              molecules received
            </p>
            <p className="text-xs text-gray-600">
              You will receive a total of {numberOfDeliveries} monthly
              deliveries over the contract period
            </p>
          </div>
        </>
      )}

      <p className="font-medium">Quantity:</p>
      <p>
        {parseInt(formValues.quantity).toLocaleString()} {unitOfMeasure}
      </p>

      <p className="font-medium">Price per {unitOfMeasure}:</p>
      <p>${eacPrice ? (eacPrice === "0.00" ? 1 : eacPrice) : 0}</p>

      <p className="font-medium">Total Price:</p>
      <p>
        $
        {totalPrice.toLocaleString()
          ? totalPrice.toLocaleString() === "0"
            ? 1 * parseInt(formValues.quantity)
            : totalPrice.toLocaleString()
          : 0}
      </p>

      {isForwardTransaction && numberOfDeliveries > 0 && (
        <>
          <p className="font-medium">Payment Schedule:</p>
          <p className="text-sm">
            ${pricePerDelivery} per monthly delivery ({numberOfDeliveries}{" "}
            payments collected upon token delivery)
          </p>
        </>
      )}

      <p className="font-medium">Segment:</p>
      <p className="capitalize">{formValues.segment}</p>

      <p className="font-medium">Offtake Point:</p>
      <p>{formValues.offtakePoint}</p>
    </div>
  );
};

export default TransactionInfoSection;
