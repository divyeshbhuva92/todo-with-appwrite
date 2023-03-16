import { useEffect, useState } from "react";
import { Paper } from "@mantine/core";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { account, databases } from "../../../appwriteConfig";

const Userhome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dbId = "6409d0710846c3cefc3c";
  const collectionId = "6409d08a12c042ab6d80";

  const [currentUserTodo, setCurrentUserTodo] = useState([]);

  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const getUser = account.get();
    getUser
      .then((response) => {
        const name = response.name;
        setUserName(name.replace(name[0], name[0].toUpperCase()));

        setUserID(response.$id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // fetch todo -------------------------------------------------------------------
  useEffect(() => {
    const getTodos = databases.listDocuments(dbId, collectionId);

    getTodos
      .then((res) => {
        // console.log(res.documents);
        setCurrentUserTodo(res.documents);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [location]);

  const itemList = currentUserTodo.filter((doc) => doc.user_id === userID);

  const handleEdit = (id) => {
    navigate(`/users/edit-todo/${id}`);
  };

  // delete todo -------------------------------------------------------------------
  const handleDelete = (id) => {
    const deleteitem = databases.deleteDocument(dbId, collectionId, id);

    deleteitem
      .then(
        (res) => {
          // console.log(res);
        },
        (err) => {
          console.log(err.message);
        }
      )
      .then(() => navigate(location.pathname))
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="main-todo-div">
      <div className="Headers">{userName}'s Todos</div>

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
