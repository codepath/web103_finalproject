import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
// import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import "chart.js/auto";

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [type, setType] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const user_id = Number(useParams().user_id);

  const API_URL = import.meta.env.VITE_API_URL || "";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/api/report`, {
//           params: { user_id, type, year, month },
//         });
//         setReportData(response.data);
//       } catch (error) {
//         console.error("Error fetching report data:", error);
//       }
//     };

//     if (user_id) {
//       fetchData();
//     }
//   }, [user_id, type, year, month]);

const handleDownloadPDF = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/report`, {
            params: { user_id, type, year, month },
        });

        setReportData(response.data);

        const reportData = response.data;
        const doc = new jsPDF();
        doc.text("Report", 20, 20);

        console.log('reportData', reportData);
        console.log('reportData[0]', reportData[0]);

        let yPosition = 30;
        
            doc.text(`${type === "monthly" ? `Month: ${month}` : `Year: ${year}`}`, 20, yPosition);
            doc.text(`Income: ${reportData[0].total}`, 20, yPosition + 10);
            doc.text(`Expenses: ${reportData[1].total}`, 20, yPosition + 20);
            yPosition += 30;

        doc.save("report.pdf");
        // window.location = "/report";
    } catch (error) {
        console.error("Error downloading report data:", error);
    }
};

//   const incomeData = {
//     labels: type === "monthly" ? `Month ${reportData[0].month}` : `Year ${reportData[0].year}`,
//     datasets: [
//       {
//         label: "Income",
//         data: reportData[0].total,
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//       },
//     ],
//   };

//   const expensesData = {
//     labels: type === "monthly" ? `Month ${reportData[1].month}` : `Year ${reportData[1].year}`,
//     datasets: [
//       {
//         label: "Expenses",
//         data: reportData[1].total,
//         backgroundColor: "rgba(255, 99, 132, 0.6)",
//       },
//     ],
//   };

  return (
    <>
      {isNaN(user_id) ? (
        <div>
          <h1>Please Login to access this page</h1>
        </div>
      ) : (
        <div>
          <h1>Report</h1>
          <div className="form-container">
            <label>
              Type:
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </label>
            <label>
              Year:
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>
            {type === "monthly" && (
              <label>
                Month:
                <input
                  type="number"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </label>
            )}
          </div>
          <button onClick={handleDownloadPDF}>Download PDF</button>
          {reportData && (
            <div>
              <Bar data={incomeData} />
              <Line data={expensesData} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Report;
