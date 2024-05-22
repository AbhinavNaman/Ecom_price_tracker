// 1. scrape the product
// 2. doing that periodically
// 3. modify the database
//    3.1. each product in DB
//    3.2  update the current, maximum, least price
// 4. if price change send  email available in each product document's userEmail array, to every user       subscribed to that product.

import { NextResponse } from "next/server";
import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { scrapeAmazonProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

export async function GET() {
  try {
    connectToDB();

    //get all products from DB
    const products = await Product.find({});

    // 1. scrape latest product details and update DB
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProduct) throw new Error("No Product found");

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];

        //updadting the database
        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          { url: scrapedProduct.url },
          product
        );

        // 2. check product status and send email accordingly
        const emailNotiType = getEmailNotifType(scrapedProduct, currentProduct);
        if (emailNotiType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(
            productInfo,
            emailNotiType
          );
          //users array
          const userEmails = updatedProduct.users.map(
            (user: any) => user.email
          );
          await sendEmail(emailContent, userEmails);
        }
        return updatedProduct;
      })
    );
    return NextResponse.json({
      message: "OK",
      data: updatedProducts,
    });
  } catch (error) {
    throw new Error(`Error in GET: ${error}`);
  }
}
