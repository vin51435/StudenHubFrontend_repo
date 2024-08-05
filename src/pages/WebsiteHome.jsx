import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const WebsiteHome = () => {
  return (
    <Container className='landing_page'>
      <section>
        <Row className='w-100 h-100'>
          <Col md='6' className='h-100 info_container'>
            <h1>Elevate Your Academic Experience</h1>
            <h6>Showcasing advanced web development skills through a comprehensive platform designed to enhance academic and community engagement. Explore features tailored to meet student needs with modern technologies.</h6>
          </Col>
          <Col md='6' className='h-100'></Col>
        </Row>
      </section>
      <section>
        <Row className='w-100 h-100'>
          <Col md='6' className='h-100'></Col>
          <Col md='6' className='h-100 info_container'>
            <h1>Interactive Event Calendar</h1>
            <h6>Stay organized with an easy-to-use calendar that keeps you informed about all upcoming campus events and deadlines.</h6>
          </Col>
        </Row>
      </section>
      <section>
        <Row className='w-100 h-100'>
          <Col md='6' className='h-100 info_container'>
            <h1>Textbook Classifieds</h1>
            <h6>Quickly find or list textbooks and study materials, showcasing an efficient user interface and database management.</h6>
          </Col>
          <Col md='6' className='h-100'></Col>
        </Row>
      </section>
    </Container>
  );
};

export default WebsiteHome;