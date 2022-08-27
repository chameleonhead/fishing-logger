import {
  ChronoUnit,
  DateTimeFormatter,
  LocalDateTime,
  Temporal,
} from "@js-joda/core";
import { useFormik } from "formik";
import { Fragment, useEffect } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { DateTimeInput } from "../inputs/DateTimeInput";
import { PlaceInput } from "../inputs/PlaceInput";
import { Catch } from "./model";

type CreateCatchFormProps = {
  onSubmit: (value: Catch) => void;
};

export const CreateCatchForm = ({ onSubmit }: CreateCatchFormProps) => {
  const formik = useFormik({
    initialValues: {
      catched_at: LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES) as
        | LocalDateTime
        | null
        | undefined,
      place: {
        latitude: 35.65809922,
        longitude: 139.74135747,
      } as
        | {
            latitude: number;
            longitude: number;
          }
        | null
        | undefined,
      fishes: [
        {
          species: "",
        },
      ],
      method_type: "",
      method_details: "",
    },
    onSubmit: (values) =>
      onSubmit({
        id: DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(values.catched_at!),
        catched_at: DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(
          values.catched_at!
        ),
        place: values.place,
        fishes: values.fishes,
        method: {
          type: values.method_type,
          details: values.method_details,
        },
      } as Catch),
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      formik.setValues({
        ...formik.values,
        place: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    });
  }, []);
  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup>
        <Label for="catched_at">
          日時{" "}
          <Badge
            color="primary"
            block
            onClick={() =>
              formik.setValues({
                ...formik.values,
                catched_at: LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES),
              })
            }
          >
            現在
          </Badge>
        </Label>
        <DateTimeInput id="catched_at" value={formik.values.catched_at} />
      </FormGroup>
      <PlaceInput
        value={formik.values.place}
        onChange={(value) => {
          formik.setValues({ ...formik.values, place: value });
        }}
      />
      <FormGroup>
        <Label for="fishes0_species">魚種</Label>
        <Input
          id="fishes0_species"
          name="fishes[0].species"
          placeholder="オオモンハタ"
          type="text"
        />
      </FormGroup>
      <FormGroup>
        <Label>仕掛け</Label>
        <div>
          <ButtonGroup className="w-100">
            {["徒手", "刺突", "網", "釣", "その他"].map((item, i) => {
              return (
                <Fragment key={i}>
                  <Input
                    type="radio"
                    id={"method_type" + i}
                    className="btn-check"
                    name="method.type"
                    value={item}
                  />
                  <Label
                    for={"method_type" + i}
                    className="btn btn-outline-primary"
                  >
                    {item}
                  </Label>
                </Fragment>
              );
            })}
          </ButtonGroup>
        </div>
      </FormGroup>
      <FormGroup>
        <Label for="method_details">備考</Label>
        <Input
          id="method_details"
          name="method.details"
          placeholder="仕掛けの詳細を記載"
          type="text"
        />
      </FormGroup>
      <Button color="primary" block>
        登録
      </Button>
    </Form>
  );
};

export default function () {
  return <CreateCatchForm onSubmit={(value) => alert(JSON.stringify(value))} />;
}
