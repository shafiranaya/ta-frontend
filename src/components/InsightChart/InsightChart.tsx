import React from "react";
import { ProgressBar } from "react-bootstrap";
import { Insight } from "@models/insight";
// Import the Insight interface

interface InsightChartProps {
  data: Insight[]; // Use the Insight interface for the data prop
}

const InsightChart: React.FC<InsightChartProps> = ({ data }) => {
  return (
    <div className="mb-5">
      {data.map((item, index) => (
        <div className="mb-3" key={index}>
          <div className="d-flex mb-1">
            <div>{item.feature}</div>
            <div className="ms-auto fw-semibold me-2">{item.countFraud}</div>
            <div className="text-black-50 small">
              ({item.percentage.toFixed(2)}%)
            </div>
          </div>
          <ProgressBar className="progress-thin" now={item.percentage} />
        </div>
      ))}
    </div>
  );
};

export default InsightChart;
// import React from "react";
// import { Table, ProgressBar } from "react-bootstrap";
// import { RiskScoreModel } from "@models/model";
// import { Insight } from "@models/insight";

// interface InsightProps {
//   insight: Insight[];
// }

// class InsightChart extends React.Component<InsightProps> {
//   //   render() {
//   render() {
//     const { insight } = this.props;

//     return (
//       <div className="mb-5">
//         {insight.map((item, index) => (
//           <div className="mb-3">
//             <div className="d-flex mb-1">
//               <div>{item.feature}</div>
//               <div className="ms-auto fw-semibold me-2">{item.countFraud}</div>
//               <div className="text-black-50 small">
//                 ({parseInt(item.percentage)}
//                 %)
//               </div>
//             </div>
//             <ProgressBar
//               className="progress-thin"
//               // variant="danger"
//               now={parseInt(item.percentage)}
//             />
//           </div>
//         ))}
//       </div>
//     );
//   }
// }

// export default InsightChart;
