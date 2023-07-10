import { NextPage } from 'next'
import { AdminLayout } from '@layout'
import { Card, Form } from 'react-bootstrap'

import axios from 'axios'
import { Dataframe } from '@models/dataframe'
import { Resource } from '@models/resource'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Insight } from '@models/insight'
import { InsightChart } from '@components/InsightChart'

type Props = {
  dataframeResource: Resource<Dataframe>;
  page: number;
  perPage: number;
  sort: string;
  order: string;
}

type MetricsData = {
  metrics: string;
  count: number;
  percentage: string;
}

type ApiResponse = {
  fraud: MetricsData;
  'non-fraud': MetricsData;
}

const InsightPage: NextPage<Props> = (props) => {
  const router = useRouter()

  const modelIndexParam = router.query.model_index // Get the model_index value from the URL query parameters

  const [modelIndex, setModelIndex] = useState(modelIndexParam || 1)

  const [apiData, setApiData] = useState<ApiResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}summary/${modelIndex}`,
        )
        setApiData(response.data)
      } catch (error) {
        console.error('API request error:', error)
      }
    }

    if (modelIndex) {
      fetchData()
    }
  }, [modelIndex])

  console.log('API DATA', apiData)

  const [insightData, setInsightData] = useState<Insight | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Insight>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}insight/${modelIndex}`,
        )
        setInsightData(response.data)
      } catch (error) {
        console.error('API request error:', error)
      }
    }

    if (modelIndex) {
      fetchData()
    }
  }, [modelIndex])

  console.log('Insight DATA', insightData)

  const fraudCount = apiData && apiData.fraud ? apiData.fraud.count || 0 : 0
  const nonFraudCount = apiData && apiData['non-fraud'] ? apiData['non-fraud'].count || 0 : 0

  const handleModelIndexChange = (event) => {
    const selectedModelIndex = event.target.value
    console.log('Selected model_index:', selectedModelIndex)

    setModelIndex(selectedModelIndex)

    const query = { ...router.query, model_index: selectedModelIndex }
    router.push({ pathname: router.pathname, query })

    console.log('Updated URL:', router.asPath)
  }

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
    </AdminLayout>
  )
}

export default InsightPage
