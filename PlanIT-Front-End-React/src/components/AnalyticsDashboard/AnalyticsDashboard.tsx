// Analytics Dashboard component that displays analytical information
// about past 5 weeks spending and next week forecasted spending and balance as well as a financial recommendation

import "./AnalyticsDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import LineChart from "../LineChart.tsx";
import Table from "../Table/Table.tsx";
import {
  getAverageDailySpending_7daysSMA,
  scheduleRecurTransactions,
  getForecastFeatures,
  getForecast,
} from "../../helper/BackendAPI.ts";
import { useEffect, useState } from "react";
import DashboardContent from "../DashboardContent/DashboardContent.tsx";

interface Props {
  accountId: number;
}

function AnalyticsDashboard({ accountId }: Props) {
  // Handle fetching and numeric dashboards
  const [average5WeeksSpending, setAverage5WeeksSpending] = useState<number>(0);
  const [average5WeeksBalance, setAverage5WeeksBalance] = useState<number>(0);
  const [forecastedNextWeekSpending, setForecastedNextWeekSpending] =
    useState<number>(0);
  const [forecastedNextWeekBalance, setForecastedNextWeekBalance] =
    useState<number>(0);
  const [dailySpendingGraphData, setDailySpendingGraphData] = useState<
    number[]
  >([0]);
  const [dailySpendingGraphLabels, setDailySpendingGraphLabels] = useState<
    string[]
  >([""]);
  const [
    averageDailySpending7DaysSMAContent,
    setAverageDailySpending7DaysSMAContent,
  ] = useState<any[]>([]);
  const [stateChange, setStateChange] = useState<boolean>(false);
  const [recommendationText, setRecommendationText] = useState<String>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const avg7DaysSMA = await getAverageDailySpending_7daysSMA(accountId);

        const dailySpendingGraphContent = avg7DaysSMA
          .filter((data: any, index: number) => data && index <= 6)
          .map((data: any) => data.total_spent);
        setDailySpendingGraphData(dailySpendingGraphContent.reverse());

        const dailySpendingGraphXLabels = avg7DaysSMA
          .filter((data: any, index: number) => data && index <= 6)
          .map((data: any) => data.day);
        setDailySpendingGraphLabels(dailySpendingGraphXLabels.reverse());

        const avgSpending7DaysSMATable = avg7DaysSMA.map(
          (item: any, index: number) => ({
            content1: index + 1,
            content2: item.day,
            content3: item.total_spent,
            content4: item.avg_daily_spending_7_days_interval,
          })
        );
        setAverageDailySpending7DaysSMAContent(avgSpending7DaysSMATable);

        const forecastFeatures = await getForecastFeatures(accountId);
        if (forecastFeatures[10] && forecastFeatures[11]) {
          setAverage5WeeksSpending(
            Math.round(forecastFeatures[10] * 100) / 100
          );
          setAverage5WeeksBalance(Math.round(forecastFeatures[11] * 100) / 100);
        }

        const forecastedData = await getForecast(accountId);
        if (forecastedData.error) {
          setRecommendationText(forecastedData.error);
        } else {
          setForecastedNextWeekSpending(
            Math.round(forecastedData.predSpend6 * 100) / 100
          );
          setForecastedNextWeekBalance(
            Math.round(forecastedData.predBal6 * 100) / 100
          );
          setRecommendationText(forecastedData.recText);
        }
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [stateChange]);

  useEffect(() => {
    // Handle realtime update of recurring transactions
    const trackState = async () => {
      const response = await scheduleRecurTransactions();
      const { isSpendingUpdated } = response[0];
      const { isSavingsUpdated } = response[1];
      (isSpendingUpdated || isSavingsUpdated) && setStateChange(!stateChange);
    };
    trackState();
    const interval = setInterval(trackState, 10000); // Realtime update every 10 seconds
    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, []);

  const avg5WeeksSpending = (
    <NumericDashboard title="5-Week spending" value={average5WeeksSpending} />
  );

  const avg5WeeksBalance = (
    <NumericDashboard title="5-Week balance" value={average5WeeksBalance} />
  );

  const forecastedSpending = (
    <NumericDashboard
      title="Forecasted next-week spending"
      value={forecastedNextWeekSpending}
    />
  );

  const forecastedBalance = (
    <NumericDashboard
      title="Forecasted next-Week balance"
      value={forecastedNextWeekBalance}
    />
  );

  //------------------------------------------------------------------

  // Handle line graph for daily spending
  const dailySpendingLineGraph = (
    <LineChart
      title="Daily spending"
      labels={dailySpendingGraphLabels}
      data={dailySpendingGraphData}
      colors={["#00B432"]}
    />
  );

  //------------------------------------------------------------------

  // Handle average 7 days SMA records
  const avg7DaysSMARecordsTableHeadings = {
    heading1: "Week",
    heading2: "Date",
    heading3: "Amount Spent",
    heading4: "7-Day Spending Average",
  };

  const avg7DaysSMARecordsTable = (
    <Table
      title="7-Day average"
      heading={avg7DaysSMARecordsTableHeadings}
      data={averageDailySpending7DaysSMAContent}
    />
  );

  return (
    <div className="analyticsDashboard">
      <div className="mainDashboardBlocks avg5WeeksSpending numericDashboard">
        {avg5WeeksSpending}
      </div>
      <div className="mainDashboardBlocks avg5WeeksBalance numericDashboard">
        {avg5WeeksBalance}
      </div>
      <div className="mainDashboardBlocks forecastedNextWeekSpending numericDashboard">
        {forecastedSpending}
      </div>
      <div className="mainDashboardBlocks forecastedNextWeekBalance numericDashboard">
        {forecastedBalance}
      </div>
      <div className="mainDashboardBlocks dailySpendingGraph lineChart">
        {dailySpendingLineGraph}
      </div>
      <div className="mainDashboardBlocks avg7DaysSMARecords records">
        {avg7DaysSMARecordsTable}
      </div>
      <div className="mainDashboardBlocks financialRecommendation wordDashboard">
        <DashboardContent
          title="Financial recommendation"
          value={
            recommendationText ? (
              <p className="recText">{recommendationText}</p>
            ) : (
              "Thinking..."
            )
          }
        />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
