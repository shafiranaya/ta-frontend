import React from "react";
import { Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import { RiskScoreModel } from "@models/model";
import { render } from "nprogress";

interface ScoreCalculationTableProps {
  riskScoreModel: RiskScoreModel;
}

class ScoreCalculationTable extends React.Component<ScoreCalculationTableProps> {
  //   render() {
  render() {
    const { riskScoreModel } = this.props;
    const sortedMapping = Object.entries(riskScoreModel.mapping).sort(
      ([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB)
    );
    const maxScore = sortedMapping[sortedMapping.length - 1][0];
    const featureAliasList = riskScoreModel.features_alias;
    const featureDescriptionList = riskScoreModel.features_description;

    return (
      <div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th className="text-center">No.</th>
              <th className="text-center">Feature</th>
              <th className="text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(riskScoreModel.model).map(([index, item]) => {
              const featureName = Object.keys(item)[0];
              const coefficient = Object.values(item)[0] as string;
              const featureAlias = featureAliasList[parseInt(index)];
              const featureDesc = featureDescriptionList[parseInt(index)];

              const tooltip = (
                <Tooltip id={`tooltip-${index}`}>{featureDesc}</Tooltip>
              );

              return (
                <tr>
                  <td className="text-center">{parseInt(index) + 1}</td>
                  <OverlayTrigger overlay={tooltip}>
                    <div>{featureAlias}</div>
                  </OverlayTrigger>
                  <td className="text-center">{coefficient}</td>
                </tr>
              );
            })}
            <tr>
              <td className="text-center fw-bold" colSpan={2}>
                Maximum Score
              </td>
              <td className="text-center fw-bold">{maxScore}</td>
            </tr>
          </tbody>
        </Table>

        <Table responsive striped bordered hover>
          <tbody>
            <tr>
              <th>SCORE</th>
              {Object.entries(sortedMapping).map(([key, value]) => (
                <th>{value[0]}</th>
              ))}
            </tr>
            <tr>
              <td>RISK</td>
              {Object.entries(sortedMapping).map(([key, value]) => (
                <td>{value[1]}</td>
              ))}
            </tr>
          </tbody>
        </Table>

        {/* <Table striped hover size="sm">
          <tbody>
            {Object.entries(riskScoreModel.mapping).map(([key, value]) => (
              <div>
                <tr>
                  <td>{key}</td>
                </tr>
                <tr>
                  <td>{value}</td>
                </tr>
              </div>
            ))}
          </tbody>
        </Table> */}
      </div>
    );
  }
}

export default ScoreCalculationTable;
