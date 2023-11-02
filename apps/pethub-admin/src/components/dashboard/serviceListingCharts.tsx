import { Box, Card, Grid, Text, useMantineTheme } from "@mantine/core";
import Chart from "react-google-charts";

export default function ServiceListingCharts({ data }) {
  const theme = useMantineTheme();
  return (
    <Box>
      <Grid>
        <Grid.Col span={6}>
          <Card shadow="sm" radius="md">
            <Chart
              chartType="PieChart"
              data={data.serviceListingDistribution}
              options={{
                title: "Service Listing by Category",
                colors: [
                  theme.colors.indigo[4],
                  theme.colors.red[4],
                  theme.colors.green[4],
                  theme.colors.blue[4],
                  theme.colors.orange[4],
                ],
                animation: {
                  startup: true,
                  easing: "inAndOut",
                  duration: 2000,
                },
              }}
              width={"100%"}
              height="600px"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card shadow="sm" radius="md">
            <Chart
              chartType="ColumnChart"
              data={data.newServiceListingData}
              options={{
                title: "New Service Listings",
                legend: "none",
                colors: [theme.colors.indigo[4]],
                animation: {
                  startup: true,
                  easing: "inAndOut",
                  duration: 2000,
                },
              }}
              width={"100%"}
              height="600px"
            />
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
