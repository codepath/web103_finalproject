import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Header from "../components/Header";

const ReadGroups = (props) => {
  const groups = props.data; // might have to use useState but no error for now

  return (
    <>
      <div className="d-flex flex p-3 gap-3">
        {groups && groups.length > 0 ? (
          groups.map((group, index) => (
            <Card
              key={group.id}
              id={group.id}
              name={group.name}
              description={group.description}
              created_by={group.created_by}
            />
          ))
        ) : (
          <h3 className="noResults">{"No Groups Yet 😞"}</h3>
        )}
      </div>
    </>
  );
};

export default ReadGroups;
