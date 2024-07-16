import "./App.scss";
import { useState, useEffect } from "react";
import { Header, Footer } from "./components/LayoutElements";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { Trash } from "react-bootstrap-icons";

interface SnippetData {
  id: number;
  snippet: string;
  cat: string | null;
  tag: string | null;
}

function App() {
  const [list, setList] = useState<SnippetData[]>([]);
  const [formSnippet, setFormSnippet] = useState<SnippetData["snippet"]>("");
  const [formCat, setFormCat] = useState<SnippetData["cat"]>("");
  const [formTag, setFormTag] = useState<SnippetData["tag"]>("");
  const [isItemDeleted, setIsItemDeleted] = useState<Boolean>(false);

  async function handleSubmit() {
    try {
      const response = await fetch("http://localhost:5412/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: formSnippet,
          cat: formCat,
          tag: formTag,
        }),
      });

      if (response.ok) {
        console.log("POST request successful");
      } else {
        console.error("POST request failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleDelete = async (itemId: SnippetData["id"]) => {
    // if (id == null || typeof id == undefined) return;

    try {
      const response = await fetch(`http://localhost:5412/delete`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id: itemId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setIsItemDeleted(true);
      } else {
        console.error("Error deleting data:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCopy = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>
  ) => {
    const target = e.target as HTMLElement;
    navigator.clipboard.writeText(target.innerText);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5412/retrieveList");
        const data = await response.json();
        setList(data);
        // console.log(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error({ message: "Error while fetching data, ", error });
      }
    };
    fetchData();
  }, [isItemDeleted]);

  return (
    <Container fluid={"lg"}>
      <Header />
      {list ? (
        <table id="snipppetsTable" className="small">
          <thead>
            <tr>
              <td className="fw-bold">Snippet</td>
              <td className="fw-bold">Category</td>
              <td className="fw-bold">Tag</td>
              <td className="fw-bold">{""}</td>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td
                  className="p-0 px-1 border font-monospace "
                  onClick={(e) => handleCopy(e)}
                >
                  {item.snippet}
                </td>
                <td className="p-0 px-1 border">{item.cat}</td>
                <td className="p-0 px-1 border">{item.tag}</td>
                <td className="p-0 px-1 border">
                  <Button
                    size={"sm"}
                    variant="danger"
                    onClick={() => {
                      handleDelete(item.id);
                    }}
                  >
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}

      <hr className="my-4" />

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          {/* <Form.Label>Snippet</Form.Label> */}
          <FormControl
            type="text"
            onChange={(e) => setFormSnippet(e.target.value)}
            placeholder="Snippet"
          />
          <FormControl
            type="text"
            onChange={(e) => setFormCat(e.target.value)}
            placeholder="Category"
          />
          <FormControl
            type="text"
            onChange={(e) => setFormTag(e.target.value)}
            placeholder="Tag"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Insert
        </Button>{" "}
      </Form>

      <Footer />
    </Container>
  );
}

export default App;
