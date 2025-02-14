import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Offcanvas, Nav } from "react-bootstrap";
  import { useUser } from "../lib/contexts";
import { logout } from "../lib/methods";

export default function Header() {
  const [user, setUser] = useUser();
  const history = useNavigate();
  const handleLogout = () => {
    logout();
    setUser(null)
    history('/')
  };
  return (
    <Navbar expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to={"/"}>
          المدرسة الرقمية
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand`}
          aria-labelledby={`offcanvasNavbarLabel-expand`}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              style={{ flex: "1" }}
              id={`offcanvasNavbarLabel-expand`}
            >
              الصفحات
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-grow-1 pe-3">
              <Nav.Link className="nav-item" as={Link} to="/">
                <span className="icon-home canvas-icon" />
                <span>الصفحة الرئيسية</span>
              </Nav.Link>
              {user && (
                <>
                  <Nav.Link className="nav-item" as={Link} to="/posts">
                    <span className="icon-mail-envelope1 canvas-icon" />
                    <span>المنشورات</span>
                  </Nav.Link>
                  {/* {!user.profile.isGuest && (
                    <Nav.Link className="nav-item" as={Link} to="/chats">
                      <span className="icon-chat canvas-icon" />
                      <span>المحادثات</span>
                    </Nav.Link>
                  )} */}
                </>
              )}
              {/* {user && user.profile.role === UserRole.isStudent ? (
                <Nav.Link className="nav-item" as={Link} to="/profile">
                  <span className="icon-profile canvas-icon" />
                  <span>الملف الشخصي</span>
                </Nav.Link>
              ) : null} */}
              {/* {user && user.profile.role === UserRole.isAdmin ? (
                <>
                  <Nav.Link as={Link} to="/dashboard">
                    <span className="icon-sliders canvas-icon" />
                    <span>لوحة التحكم</span>
                  </Nav.Link>
                </>
              ) : null} */}
              {user ? (
                <>
                  <Nav.Link className="nav-item" as={Link} to="/exams">
                    <span className="icon-paper canvas-icon" />
                    <span>الإمتحانات</span>
                  </Nav.Link>
                  <Nav.Link className="nav-item" as={Link} to="/tests">
                    <span className="icon-paper canvas-icon" />
                    <span>المذاكرات</span>
                  </Nav.Link>
                  <Nav.Link
                    as={'div'}
                    style={{cursor: 'pointer'}}
                    className="nav-item"
                    onClick={handleLogout}
                  >
                    <span className="icon-exit canvas-icon" />
                    <span>تسجيل الخروج</span>
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link className="nav-item" as={Link} to="/login">
                    <span className="icon-person_search canvas-icon" />
                    <span>تسجيل الدخول</span>
                  </Nav.Link>
                  <Nav.Link className="nav-item" as={Link} to="/signin">
                    <span className="icon-user-plus canvas-icon" />
                    <span>إنشاء حساب</span>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
