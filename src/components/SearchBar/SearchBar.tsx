import React, { useState } from 'react'
import {
  Container,
  Form,
  FormControl,
  Button,
  InputGroup,
} from 'react-bootstrap'

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  return (
    <Container>
      <Form style={{ display: 'flex', alignItems: 'center' }}>
        <FormControl
          type="text"
          placeholder="Search"
          className="mr-sm-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <Button variant="outline-success" onClick={handleSearch}>
          Search
        </Button>
      </Form>
    </Container>
  )
}

export default SearchBar
