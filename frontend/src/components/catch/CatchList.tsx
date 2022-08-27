import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";
import { Catch } from "./model";

type CatchListProps = {
  data: Catch[];
};

export const CatchList = ({ data }: CatchListProps) => {
  return (
    <ListGroup>
      {data.map((item) => {
        return (
          <ListGroupItem key={item.id}>
            <ListGroupItemHeading>{item.catched_at}</ListGroupItemHeading>
            <ListGroupItemText>{item.fishes[0].species}</ListGroupItemText>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
};

export default CatchList;
