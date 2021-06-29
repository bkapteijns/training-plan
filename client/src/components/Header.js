import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function Header({ ownedPrograms, allPrograms, basket }) {
  const [dropdownExpanded, setDropdownExpanded] = useState(false);

  const history = useHistory();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand onClick={() => history.push("/")}>
        trainingplan.fitness
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => history.push("/")}>Home</Nav.Link>
          <Nav.Link onClick={() => history.push("/landing")}>
            Free ebook
          </Nav.Link>
          <NavDropdown
            title={
              <span onClick={() => history.push("/programs")}>Programs</span>
            }
            id="hover-dropdown"
            show={dropdownExpanded}
            onMouseEnter={() => setDropdownExpanded(true)}
            onMouseLeave={() => setDropdownExpanded(false)}
          >
            <NavDropdown.Header>Your programs</NavDropdown.Header>
            {ownedPrograms &&
              ownedPrograms.map((p) => (
                <NavDropdown.Item
                  onClick={() => {
                    history.push("/programs/basic");
                  }}
                >
                  {p.name}
                </NavDropdown.Item>
              ))}
            <NavDropdown.Divider />
            <NavDropdown.Header>Other programs</NavDropdown.Header>
            {allPrograms &&
              allPrograms
                .filter(
                  (p) =>
                    ownedPrograms &&
                    !ownedPrograms.map((op) => op.name).includes(p.name)
                )
                .map((p) => (
                  <NavDropdown.Item
                    onClick={() => history.push(`/programs/${p.name}`)}
                  >
                    {p.name}
                  </NavDropdown.Item>
                ))}
          </NavDropdown>
        </Nav>
        <Nav className="ml-auto">
          <Button
            variant="outline-light"
            style={{ marginRight: 5 }}
            onClick={() => history.push("/login")}
          >
            Login or register
          </Button>
          {basket && basket.length > 0 && <Button>Purchase</Button>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
