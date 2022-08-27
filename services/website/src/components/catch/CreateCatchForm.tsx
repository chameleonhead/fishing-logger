import { ChronoUnit, DateTimeFormatter, LocalDateTime } from "@js-joda/core";
import { useFormik } from "formik";
import { Fragment } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Input,
  Label,
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
      place: undefined as
        | {
            latitude: number;
            longitude: number;
          }
        | null
        | undefined,
      fishes_species: [""],
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
        fishes: values.fishes_species.map((value, i) => ({ species: value })),
        method: {
          type: values.method_type,
          details: values.method_details,
        },
      } as Catch),
  });
  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup>
        <div>
          <Label for="catched_at">日時</Label>{" "}
          <Badge
            color="primary"
            onClick={() =>
              formik.setValues({
                ...formik.values,
                catched_at: LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES),
              })
            }
          >
            現在
          </Badge>
        </div>
        <DateTimeInput id="catched_at" value={formik.values.catched_at} />
      </FormGroup>
      <PlaceInput
        value={formik.values.place}
        onChange={(value) => {
          formik.setValues({ ...formik.values, place: value });
        }}
      />
      <FormGroup>
        <Label for="fishes_species0">魚種</Label>
        <Input
          id="fishes_species0"
          name="fishes_species[0]"
          placeholder="オオモンハタ"
          type="text"
          value={formik.values.fishes_species[0]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
                    name="method_type"
                    value={item}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
          name="method_details"
          placeholder="仕掛けの詳細を記載"
          type="text"
          value={formik.values.method_details}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
