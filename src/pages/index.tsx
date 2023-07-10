import { GetServerSideProps, NextPage } from "next";
import { AdminLayout } from "@layout";
import { Card, Button, Form, Dropdown } from "react-bootstrap";

import axios from "axios";
import { Dataframe } from "@models/dataframe";
import { newResource, Resource } from "@models/resource";
import React, { useState, useEffect } from "react";
import { Pagination } from "@components/Pagination";
import { DataframeList } from "@components/Dataframe";
import { SearchBar } from "@components/SearchBar";
import { transformResponseWrapper, useSWRAxios } from "@hooks";
import { useRouter } from "next/router";
import { saveAs } from "file-saver";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { RiskScoreModel } from "@models/model";
import { Insight } from "@models/insight";
import { ScoreCalculationTable } from "@components/ScoreCalculationTable";
import { InsightChart } from "@components/InsightChart";

type Props = {
  dataframeResource: Resource<Dataframe>;
  page: number;
  perPage: number;
  sort: string;
  order: string;
};

type MetricsData = {
  metrics: string;
  count: number;
  percentage: string;
};

type ApiResponse = {
  fraud: MetricsData;
  "non-fraud": MetricsData;
};

const Dataframes: NextPage<Props> = (props) => {
  const { dataframeResource, page, perPage, sort, order } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const modelIndexParam = router.query.model_index; // Get the model_index value from the URL query parameters

  const [modelIndex, setModelIndex] = useState(modelIndexParam || 1);

  const [apiData, setApiData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}summary/${modelIndex}`
        );
        setApiData(response.data);
      } catch (error) {
        console.error("API request error:", error);
      }
    };

    if (modelIndex) {
      fetchData();
    }
  }, [modelIndex]);

  console.log("API DATA", apiData);

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

  const [insightData, setInsightData] = useState<Insight | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Insight>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}insight/${modelIndex}`
        );
        setInsightData(response.data);
      } catch (error) {
        console.error("API request error:", error);
      }
    };

    if (modelIndex) {
      fetchData();
    }
  }, [modelIndex]);

  console.log("Insight DATA", insightData);

  const fraudCount = apiData && apiData.fraud ? apiData.fraud.count || 0 : 0;
  const nonFraudCount =
    apiData && apiData["non-fraud"] ? apiData["non-fraud"].count || 0 : 0;

  // TODO: fraud and non-fraud percentage

  const handleSearch = () => {
    const query = { ...router.query, _search: searchTerm };
    router.push({ pathname: router.pathname, query });
  };

  const handleModelIndexChange = (event) => {
    const selectedModelIndex = event.target.value;
    console.log("Selected model_index:", selectedModelIndex);

    setModelIndex(selectedModelIndex);

    const query = { ...router.query, model_index: selectedModelIndex };
    router.push({ pathname: router.pathname, query });

    console.log("Updated URL:", router.asPath);
  };

  const handleExportCSV = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}export-csv`, {
        params: {
          model_index: modelIndex, // Default model index
          _page: 1,
          _limit: 0, // Set to 0 to export all data
          _sort: sort,
          _order: order,
          _search: searchTerm,
        },
        responseType: "blob", // Set the response type to blob
      })
      .then((response) => {
        // Extract the filename from the response headers
        const contentDisposition = response.headers["content-disposition"];
        const filenameMatch = contentDisposition
          ? contentDisposition.match(/filename="(.+)"/i)
          : null;
        const filename = filenameMatch ? filenameMatch[1] : "export.csv";

        // Create a Blob object from the response data
        const blob = new Blob([response.data], { type: "text/csv" });

        // Save the Blob object as a file
        saveAs(blob, filename);

        // Console log indicating that the API request was successful
        console.log("API request successful");
      })
      .catch((error) => {
        console.error("Export CSV error:", error);
      });
  };
  const listURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}prediction` || "";
  console.log("URL DATAFRAME", listURL);
  // console.log(listURL);
  // console.log("ListURL: ", listURL.length);
  // swr: data -> axios: data -> resource: data
  const {
    data: { data: resource },
  } = useSWRAxios<Resource<Dataframe>>(
    {
      url: listURL,
      params: {
        model_index: modelIndex,
        _page: page,
        _limit: perPage,
        _sort: sort,
        _order: order,
        _search: searchTerm, // Add search term to the API request
      },
      transformResponse: transformResponseWrapper((d: Dataframe[], h) => {
        const total = h ? parseInt(h["x-total-count"], 10) : 0;
        console.log("total count: ", h["x-total_count"]);
        console.log("Headers: ", h);

        console.log("total: ", total);

        return newResource(d, total, page, perPage);
      }),
    },
    {
      data: dataframeResource,
      headers: {
        "x-total-count": dataframeResource.meta.total.toString(),
      },
    }
  );

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

      <Card>
        <Card.Header>Insight</Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-6">
                  <div className="border-start border-4 border-danger px-3 mb-3">
                    <small className="text-black-50">Fraud</small>
                    <div className="fs-5 fw-semibold">{fraudCount}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border-start border-4 border-success px-3 mb-3">
                    <small className="text-black-50">Non-Fraud</small>
                    <div className="fs-5 fw-semibold">{nonFraudCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {/* Check if modelData is available */}
            {insightData ? (
              <InsightChart data={insightData} />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </Card.Body>
      </Card>
      <br />
      <Card>
        <Card.Header>Data</Card.Header>

        <Card.Body>
          <SearchBar onSearch={setSearchTerm} />
          <br />
          <Pagination meta={resource.meta} />
          <DataframeList dataframes={resource.data} modelData={modelData} />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="primary" onClick={handleExportCSV}>
              <FontAwesomeIcon icon={faDownload} fixedWidth /> Export to CSV
            </Button>
          </div>
          <br />
          <Pagination meta={resource.meta} />
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const listURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}prediction` || "";
  console.log("url data", listURL);

  let modelIndex = 1; // Default model index
  if (
    context.query?.model_index &&
    typeof context.query.model_index === "string"
  ) {
    modelIndex = parseInt(context.query.model_index, 10);
  }

  let page = 1;
  if (context.query?.page && typeof context.query.page === "string") {
    page = parseInt(context.query.page, 10);
  }

  let perPage = 20;
  if (context.query?.per_page && typeof context.query.per_page === "string") {
    perPage = parseInt(context.query.per_page.toString(), 10);
  }

  let sort = "risk_percentage";
  if (context.query?.sort && typeof context.query.sort === "string") {
    sort = context.query.sort;
  }

  let order = "desc";
  if (context.query?.order && typeof context.query.order === "string") {
    order = context.query.order;
  }

  const { data: dataframes, headers } = await axios.get<Dataframe[]>(listURL, {
    params: {
      model_index: modelIndex,
      _page: page,
      _limit: perPage,
      _sort: sort,
      _order: order,
    },
  });

  const total = parseInt(headers["x-total-count"], 10);
  const dataframeResource: Resource<Dataframe> = newResource(
    dataframes,
    total,
    page,
    perPage
  );

  console.log("total df", total);
  console.log("perPage", perPage);
  return {
    props: {
      dataframeResource,
      page,
      perPage,
      sort,
      order,
    }, // will be passed to the page component as props
  };
};

export default Dataframes;
