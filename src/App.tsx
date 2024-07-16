import "./App.scss";
import { useState, useEffect } from "react";
import { Header, Footer } from "./components/LayoutElements";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Trash } from "react-bootstrap-icons";

const {
  VITE_PORT,
  VITE_APIURL,
  VITE_QUERY_RETRIEVE,
  VITE_QUERY_DELETE,
  VITE_QUERY_INSERT,
} = import.meta.env;

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
  const [isListUpdated, setIsListUpdated] = useState<boolean>(false);

  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${VITE_APIURL}:${VITE_PORT}/${VITE_QUERY_RETRIEVE}`);
        const data = await response.json();
        setList(data);
      } catch (error) {
        console.error({ message: "Error while fetching data, ", error });
      } finally {
        setIsListUpdated(false)
      }
    };
    fetchData();
  }, [isListUpdated]);



  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    try {
      const response = await fetch(`${VITE_APIURL}:${VITE_PORT}/${VITE_QUERY_INSERT}`, {
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
        setIsListUpdated(true);
      } else {
        console.error("POST request failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }



  async function handleDelete(itemId: SnippetData["id"]) {
    try {
      const response = await fetch(`${VITE_APIURL}:${VITE_PORT}/${VITE_QUERY_DELETE}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id: itemId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setIsListUpdated(true);
      } else {
        console.error("Error deleting data:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }



  function handleCopy(
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>
  ) {
    const target = e.target as HTMLElement;
    navigator.clipboard.writeText(target.innerText);
  }



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

      <Form onSubmit={(e)=>{handleSubmit(e)}}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control
            type="text"
            onChange={(e) => setFormSnippet(e.target.value)}
            placeholder="Snippet"
          />
          <Form.Control
            type="text"
            onChange={(e) => setFormCat(e.target.value)}
            placeholder="Category"
          />
          <Form.Control
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
