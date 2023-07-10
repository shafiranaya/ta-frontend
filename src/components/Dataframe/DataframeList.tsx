import {
  Form,
  Table,
  Row,
  Col,
  Dropdown,
  Alert,
  Modal,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Dataframe } from "@models/dataframe";
import { RiskScoreModel } from "@models/model";
import { THSort } from "@components/TableSort";
import { SearchBar } from "@components/SearchBar";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const typeColorMap = {
  fraud: "#dc3545", // Red color for fraud
  "non-fraud": "#28a745", // Green color for non-fraud
};

type TypeLabelProps = {
  type: string;
};

const TypeLabel = ({ type }: TypeLabelProps) => (
  <span
    className={`badge ${type === "fraud" ? "bg-danger" : "bg-success"}`}
    style={{
      color: "#fff",
      fontSize: "0.7rem",
      width: "70px",
    }}
  >
    {type}
  </span>
);

// type Props = {
//   dataframes: Dataframe[];
// } & Pick<Parameters<typeof THSort>[0], "setSort" | "setOrder">;

type Props = {
  dataframes: Dataframe[];
  modelData: RiskScoreModel | null; // Add the modelData prop
} & Pick<Parameters<typeof THSort>[0], "setSort" | "setOrder">;

export default function DataframeList(props: Props) {
  const { dataframes, setSort, setOrder, modelData } = props;

  // export default function DataframeList(props: Props) {
  //   const { dataframes, setSort, setOrder } = props;
  const featureKeys = Object.keys(dataframes[0]?.feature_score || {});

  const [blockedAccounts, setBlockedAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [clickedAccounts, setClickedAccounts] = useState<string[]>([]);

  const openBlockModal = (accountId: string) => {
    // setSelectedAccount(accountId);
    setIsBlockModalOpen(true);
  };

  const closeBlockModal = () => {
    setSelectedAccount(null);
    setIsBlockModalOpen(false);
  };

  const handleBlockAccount = async (accountId: string) => {
    try {
      // Make an API request to block the account
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}block/${accountId}`
      );
      setBlockedAccounts((prevBlockedAccounts) => [
        ...prevBlockedAccounts,
        accountId,
      ]);
    } catch (error) {
      console.error("Error blocking the account:", error);
    }
  };

  const isAccountBlocked = (accountId: string) => {
    return blockedAccounts.includes(accountId);
  };

  // const isAccountClicked = (accountId: string) => {
  //   return (
  //     clickedAccounts.hasOwnProperty(accountId) && clickedAccounts[accountId]
  //   );
  // };

  const handleClick = (accountId: string) => {
    setClickedAccounts((prevClickedAccounts) => ({
      ...prevClickedAccounts,
      [accountId]: true,
    }));
    handleBlockAccount(accountId);
    openBlockModal(accountId);
  };

  // useEffect(() => {
  //   // Fetch the account status on component mount
  //   const fetchAccountStatus = async () => {
  //     for (const row of dataframes) {
  //       try {
  //         const response = await axios.get(
  //           `${process.env.NEXT_PUBLIC_API_BASE_URL}status/${row.account_id}`
  //         );
  //         const { status } = response.data;
  //         if (status === "Blocked") {
  //           setBlockedAccounts((prevBlockedAccounts) => [
  //             ...prevBlockedAccounts,
  //             row.account_id,
  //           ]);
  //         }
  //       } catch (error) {
  //         console.error(
  //           `Error fetching account status for account ID ${row.account_id}:`,
  //           error
  //         );
  //       }
  //     }
  //   };
  // fetchAccountStatus();
  // }, [dataframes]);
  useEffect(() => {
    // Fetch the account status on component mount
    const fetchAccountStatus = async () => {
      try {
        const requests = dataframes.map((row) =>
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}status/${row.account_id}`
          )
        );

        const responses = await Promise.all(requests);

        responses.forEach((response, index) => {
          const { status } = response.data;
          if (status === "Blocked") {
            setBlockedAccounts((prevBlockedAccounts) => [
              ...prevBlockedAccounts,
              dataframes[index].account_id,
            ]);
          }
        });
      } catch (error) {
        console.error("Error fetching account status:", error);
      }
    };

    fetchAccountStatus();
  }, [dataframes]);

  if (dataframes.length === 0) {
    return <Alert variant="danger">Data not found.</Alert>;
  }
  return (
    <>
      {" "}
      <Table responsive bordered hover size="sm">
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "5%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead className="bg-light">
          <tr>
            <th className="text-center">
              <THSort name="account_id" setSort={setSort} setOrder={setOrder}>
                Account ID
              </THSort>
            </th>
            <th className="text-center">
              <THSort name="email" setSort={setSort} setOrder={setOrder}>
                Email
              </THSort>
            </th>
            <th className="text-center">
              <THSort
                name="risk_percentage"
                setSort={setSort}
                setOrder={setOrder}
              >
                Risk Percentage
              </THSort>
            </th>
            <th className="text-center">
              <THSort name="label" setSort={setSort} setOrder={setOrder}>
                Label
              </THSort>
            </th>
            {featureKeys.map((key, index) => {
              const featureAlias =
                modelData &&
                modelData.features_alias &&
                modelData.features_alias[index];
              const featureDesc =
                modelData &&
                modelData.features_description &&
                modelData.features_description[index];

              const tooltip = (
                <Tooltip id={`tooltip-${index}`}>{featureDesc}</Tooltip>
              );

              return (
                <th key={key} className="text-center">
                  <OverlayTrigger overlay={tooltip}>
                    <div>{key}</div>
                  </OverlayTrigger>
                </th>
              );
            })}

            <th className="text-center">
              <THSort name="total_score">Total Score</THSort>
            </th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {dataframes.map((row) => (
            <tr key={row.account_id}>
              <td>{row.account_id}</td>
              <td>{row.email}</td>
              <td className="text-center">{row.risk_percentage}</td>
              <td className="text-center">
                <TypeLabel type={row.label} />
              </td>

              {featureKeys.map((key, index) => (
                <td key={key} className="text-center">
                  {row.feature_score[key]}
                </td>
              ))}
              <td className="text-center">{row.total_score}</td>
              <td className="text-center">
                {isAccountBlocked(row.account_id) ? (
                  <Button
                    // variant="danger"
                    disabled={isAccountBlocked(row.account_id)}
                    size="sm"
                    //  className="badge bg-danger"
                  >
                    Blocked
                  </Button>
                ) : (
                  <div>
                    <Button
                      // variant="danger"
                      disabled={isAccountBlocked(row.account_id)}
                      onClick={() => handleClick(row.account_id)}
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faBan} />{" "}
                      {isAccountBlocked(row.account_id) ? "Blocked" : "Block"}
                    </Button>
                    <Modal show={isBlockModalOpen} onHide={closeBlockModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Account Blocked</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>You have successfully blocked this account.</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={closeBlockModal}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
