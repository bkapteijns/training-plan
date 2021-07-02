import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function Header({
  loggedIn,
  logout,
  ownedPrograms,
  allPrograms,
  basket,
  setMoveToast
}) {
  const [programsExpanded, setProgramsExpanded] = useState(false);
  const [basketExpanded, setBasketExpanded] = useState(false);
  const history = useHistory();

  useEffect(() => setMoveToast(basketExpanded), [basketExpanded, setMoveToast]);

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
            <NavDropdown.Header>Your programs</NavDropdown.Header>
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
              onClick={logout}
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
          {basket && basket.length > 0 && (
            <NavDropdown
              title={
                <span onClick={() => history.push("/basket")}>Basket</span>
              }
              id="shopping-basket-dropdown"
              alignRight
              show={basketExpanded}
              onMouseEnter={() => setBasketExpanded(true)}
              onMouseLeave={() => setBasketExpanded(false)}
            >
              <NavDropdown.Header>Programs</NavDropdown.Header>
              {basket.map((i) => (
                <NavDropdown.Item
                  key={i}
                  onClick={() => history.push(`/programs/${i}`)}
                >
                  {i
                    .trim()
                    .toLowerCase()
                    .replace(/\w\S*/g, (w) =>
                      w.replace(/^\w/, (c) => c.toUpperCase())
                    )}
                </NavDropdown.Item>
              ))}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => history.push("/payment")}>
                Purchase now
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
