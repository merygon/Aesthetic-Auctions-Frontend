"use client";
import HeaderSimple from "@/components/Header/HeaderLR";
import AuctionBids from "@/app/auctionBids/partials/AuctionBids/AuctionBids";
// import { Suspense } from "react";
// import { useSearchParams } from "next/navigation";

export default function UserBids() {
  // const searchParams = useSearchParams();
  // const auctionId = searchParams.get("id");
  return (
    <>
      <HeaderSimple />
      <AuctionBids />
      {/* <AuctionBids auctionId={auctionId} /> */}
    </>
  );
}
