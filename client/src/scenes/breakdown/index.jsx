import React from "react";
import { Box } from "@mui/material";
import Header from "components/Header";
import BreakdownChart from "components/BreakdownChart";
import Layout from "scenes/layout";

const Breakdown = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      {user != null ? (
        <div>
          <Layout />
          <Box m="1.5rem 2.5rem">
            <Header title="BREAKDOWN" subtitle="Sales by category" />
            <Box mt="40px" height="75vh">
              <BreakdownChart />
            </Box>
          </Box>
        </div>
      ) : null}
    </div>
  );
};

export default Breakdown;
