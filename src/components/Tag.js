import React from "react";

/**
 * Each tag will be placed into one of five categories as an
 * additional metadata element: tesla, space, energy, work,
 * and misc.
 */
export const Tag = (props) => {
  const tag = React.useState(props.name);
  let classname = "tag ";
  // console.log(tag);

  if (tag[0] === "tesla") {
    classname += "tesla"
  } else if (tag[0] === "space") {
    classname += "space"
  } else if (tag[0] === "solar") {
    classname += "energy"
  } else if (tag[0] === "working") {
    classname += "work"
  } else {
    classname += "misc"
  }

  return (
    <div className={classname}>
      <h5>{tag}</h5>
    </div>
  )
}