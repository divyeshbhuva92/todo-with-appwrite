import { useEffect, useState } from "react";
import { Paper } from "@mantine/core";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { databases } from "../../appwriteConfig";

const Userhome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [itemList, setItemList] = useState([]);

  // fetch todo -------------------------------------------------------------------
  useEffect(() => {
    const getTodos = databases.listDocuments(
      "63f88d27c0c0c0e90da0",
      "63f88d3cd3f574472792"
    );

    getTodos.then((res) => {
      setItemList(res.documents);
      // console.log(res.documents.forEach((doc) => console.log(doc.$id)));
    });
  }, [location]);

  const handleEdit = (id) => {
    navigate(`/users/edit-todo/${id}`);
  };

  // delete todo -------------------------------------------------------------------
  const handleDelete = (id) => {
    // console.log(id);
    const deleteitem = databases.deleteDocument(
      "63f88d27c0c0c0e90da0",
      "63f88d3cd3f574472792",
      id
    );

    deleteitem
      .then(
        (res) => {
          // console.log(res);
        },
        (err) => {
          console.log(err.message);
        }
      )
      .then(() => navigate(location.pathname));
  };

  return (
    <div className="main-div">
      <div className="showItems">
        {itemList &&
          itemList.map((elem) => {
            return (
              <Paper className="Item" shadow="lg" key={elem.$id}>
                <div className="todo-title-container">
                  <div className="todotitle">{elem.title}</div>
                  <div className="itemButtons">
                    <Link
                      className="btn-edit"
                      to={`/users/edit-todo/${elem.$id}`}
                      onClick={handleEdit}
                    >
                      <EditRoundedIcon />
                    </Link>
                    <Link
                      className="btn-delete"
                      onClick={() => handleDelete(elem.$id)}
                    >
                      <DeleteIcon />
                    </Link>
                  </div>
                </div>
                <div className="todo-details">{elem.description}</div>
              </Paper>
            );
          })}
      </div>
    </div>
  );
};

export default Userhome;
