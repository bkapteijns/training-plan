import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function Header({
  loggedIn,
  logout,
  ownedPrograms,
  allPrograms
}) {
  const [programsExpanded, setProgramsExpanded] = useState(false);
  const history = useHistory();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ zIndex: 999 }}>
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
          {loggedIn && (
            <Nav.Link onClick={() => history.push("/equipment")}>
              Equipment
            </Nav.Link>
          )}
          <NavDropdown
            title={
              <span onClick={() => history.push("/programs")}>Programs</span>
            }
            id="program-dropdown"
            show={programsExpanded}
            onMouseEnter={() => setProgramsExpanded(true)}
            onMouseLeave={() => setProgramsExpanded(false)}
          >
            {loggedIn && <NavDropdown.Header>Your programs</NavDropdown.Header>}
            {ownedPrograms &&
              ownedPrograms.map((p) => (
                <NavDropdown.Item
                  key={p.name}
                  onClick={() => {
                    history.push("/programs/basic");
                  }}
                >
                  {p.name
                    .trim()
                    .toLowerCase()
                    .replace(/\w\S*/g, (w) =>
                      w.replace(/^\w/, (c) => c.toUpperCase())
                    )}
                </NavDropdown.Item>
              ))}
            {loggedIn && <NavDropdown.Divider />}
            {loggedIn && (
              <NavDropdown.Header>Other programs</NavDropdown.Header>
            )}
            {allPrograms &&
              allPrograms
                .filter(
                  (p) =>
                    ownedPrograms &&
                    !ownedPrograms.map((op) => op.name).includes(p.name)
                )
                .map((p) => (
                  <NavDropdown.Item
                    key={p.name}
                    onClick={() => history.push(`/programs/${p.name}`)}
                  >
                    {p.name
                      .trim()
                      .toLowerCase()
                      .replace(/\w\S*/g, (w) =>
                        w.replace(/^\w/, (c) => c.toUpperCase())
                      )}
                  </NavDropdown.Item>
                ))}
          </NavDropdown>
        </Nav>
        <Nav className="ml-auto">
          {loggedIn ? (
            <Button
              variant="outline-light"
              style={{ marginRight: 5 }}
              onClick={() => {
                logout();
                history.push("/");
              }}
            >
              Log out
            </Button>
          ) : (
            <Button
              variant="outline-light"
              style={{ marginRight: 5 }}
              onClick={() => history.push("/login")}
            >
              Login or register
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
