import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");

  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false, type: "", message: "" });

  const showAlert = (show = false, type = "", message="") => {
    setAlert({ show, type, message });
  };

  const clearList = () => {
    showAlert(true, "danger", "Basket is empty");
    setList([]);
  };
  const removeItem = (id,title) => {
    showAlert(true, 'danger', ` '${title}' is removed from the basket`);
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => {
      return item.id === id;
    });
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!name) {
      showAlert(true, "danger", "please enter value");
      setAlert({ show: true, message: "please enter value", type: "danger" });
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }

          return item;
        })
      );

      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", `Item changed to '${name}'`);
    } else {
      showAlert(true, "success",  `'${name}' is added to the list`);

      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  useEffect(() => {0
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={submitHandler}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button className="submit-btn" type="submit">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>

      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;