/* eslint-disable react/prop-types */
import { Container, Typography, Grid2, Paper, Button } from "@mui/material";
import "../css/Home.css";
import * as d3 from "d3";
import { useEffect } from "react";

const Home = (props) => {
  const id = props?.user?.user_id;
  const drawChart = () => {
    const data = [12, 36, 45, 60, 20, 65, 75];
    const width = 400;
    const height = 200;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("fill", "black")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    const line = d3
      .line()
      .x((d, i) => x(i))
      .y((d) => y(d));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(data.length));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "teal")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  };

  useEffect(() => {
    // drawChart();
  }, [id]);

  return (
    <>
    <Container className="container" width="100%">
      <Grid2
        container
        spacing={3}
        justifyContent="center"
        className="container"
        display="flex"
        flexWrap="wrap"
      >
        <Grid2 item xs={12} sm={6} maxWidth="60%" width="40%" minHeight="70px">
          <Paper style={{ padding: "1rem", height: "70%" }}>
            <Button
              color="light"
              variant="contained"
              style={{ border: "1px solid #f2c069" }}
              onClick={() => (window.location.href = `/expenses/${id}`)}
            >
              Track Expenses
            </Button>
            <Typography>
              Easily track your daily expenses and categorize them to see where
              your money is going.
            </Typography>
          </Paper>
        </Grid2>
        <Grid2 item xs={12} sm={6} maxWidth="60%" width="40%" minHeight="70px">
          <Paper style={{ padding: "1rem", height: "70%" }}>
            <Button
              color="light"
              variant="contained"
              style={{ border: "1px solid #f2c069" }}
              onClick={() => (window.location.href = `/income/${id}`)}
            >
              Track Income
            </Button>
            <Typography>
              Monitor your income sources and keep track of your earnings.
            </Typography>
          </Paper>
        </Grid2>
        <Grid2 item xs={12} sm={6} maxWidth="60%" width="40%" minHeight="70px">
          <Paper style={{ padding: "1rem", height: "70%" }}>
            <Button
              color="light"
              variant="contained"
              style={{ border: "1px solid #f2c069" }}
              onClick={() => (window.location.href = `/savings/${id}`)}
            >
              Set Saving Goals
            </Button>
            <Typography>
              Set saving goals and track your progress to achieve financial
              freedom.
            </Typography>
          </Paper>
        </Grid2>
        <Grid2 item xs={12} sm={6} maxWidth="60%" width="40%" minHeight="70px">
          <Paper style={{ padding: "1rem", height: "70%" }}>
            <Button
              color="light"
              variant="contained"
              style={{ border: "1px solid #f2c069" }}
            >
              Set Budgets
            </Button>
            <Typography>
              Set monthly budgets to manage your spending and save more money.
            </Typography>
          </Paper>
        </Grid2>
        <Grid2 item xs={12} sm={6} maxWidth="60%" width="40%" minHeight="70px">
          <Paper style={{ padding: "1rem", height: "70%" }}>
            <Button
              color="light"
              variant="contained"
              style={{ border: "1px solid #f2c069" }}
              onClick={() => (window.location.href = `/reports/${id}`)}
            >
              View Reports
            </Button>
            <Typography>
              Generate reports to analyze your spending habits and make informed
              financial decisions.
            </Typography>
          </Paper>
        </Grid2>
      </Grid2>
    </Container>
    {/* <div id="chart"></div> */}
    </>
  );
};

export default Home;
