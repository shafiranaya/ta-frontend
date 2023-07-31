import { NextPage } from "next";
import { AdminLayout } from "@layout";
import { Card, Form } from "react-bootstrap";

import axios from "axios";
import { Dataframe } from "@models/dataframe";
import { Insight } from "@models/insight";
import { RiskScoreModel } from "@models/model";
import { Resource } from "@models/resource";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ScoreCalculationTable } from "@components/ScoreCalculationTable";

type Props = {
  dataframeResource: Resource<Dataframe>;
  page: number;
  perPage: number;
  sort: string;
  order: string;
};

const ModelDetailPage: NextPage<Props> = () => {
  const router = useRouter();

  const modelIndexParam = router.query.model_index; // Get the model_index value from the URL query parameters

  const [modelIndex, setModelIndex] = useState(modelIndexParam || 1);

  const [modelData, setModelData] = useState<RiskScoreModel | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<RiskScoreModel>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}model/${modelIndex}`
        );
        setModelData(response.data);
      } catch (error) {
        console.error("API request error:", error);
      }
    };

    if (modelIndex) {
      fetchData();
    }
  }, [modelIndex]);

  console.log("MODEL DATA", modelData);

  const handleModelIndexChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedModelIndex = event.target.value;
    console.log("Selected model_index:", selectedModelIndex);

    setModelIndex(selectedModelIndex);

    const query = { ...router.query, model_index: selectedModelIndex };
    router.push({ pathname: router.pathname, query });

    console.log("Updated URL:", router.asPath);
  };

  return (
    <AdminLayout>
      <Form.Group>
        <Form.Label>Select Model</Form.Label>
        <Form.Select
          aria-label="Select Model"
          value={modelIndex}
          onChange={handleModelIndexChange}
        >
          <option value="1">Model 1</option>
          <option value="2">Model 2</option>
          <option value="3">Model 3</option>
          <option value="4">Model 4</option>
          <option value="5">Model 5</option>
        </Form.Select>
      </Form.Group>
      <br />
      <Card>
        <Card.Header>Model {modelIndex} Details</Card.Header>
        <Card.Body>
          <div>
            {/* <h1>The Risk Score is:</h1> */}

            <div>
              {/* Check if modelData is available */}
              {modelData ? (
                <ScoreCalculationTable riskScoreModel={modelData} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
      <br />
    </AdminLayout>
  );
};

export default ModelDetailPage;
