import {
  Timestamp,
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface MonthlyChartData {
  month: string;
  revenue: number;
  orders: number;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export async function getDashboardCharts(): Promise<
  MonthlyChartData[]
> {
  const ordersSnapshot = await getDocs(
    collection(db, "orders")
  );

  const monthlyData = MONTHS.map((month) => ({
    month,
    revenue: 0,
    orders: 0,
  }));

  ordersSnapshot.forEach((doc) => {
    const order = doc.data();

    if (!(order.createdAt instanceof Timestamp)) {
      return;
    }

    const date = order.createdAt.toDate();
    const monthIndex = date.getMonth();

    monthlyData[monthIndex].orders += 1;

    monthlyData[monthIndex].revenue +=
      typeof order.totalAmount === "number"
        ? order.totalAmount
        : 0;
  });

  return monthlyData;
}