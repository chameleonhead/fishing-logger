import { ChronoUnit, DateTimeFormatter, LocalDateTime } from "@js-joda/core";
import { useFormik } from "formik";
import { useEffect } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { PlaceInput } from "../map/PlaceInput";
import { Catch } from "./model";

type CreateCatchFormProps = {
  onSubmit: (value: Catch) => void;
};

export const CreateCatchForm = ({ onSubmit }: CreateCatchFormProps) => {
  const formik = useFormik({
    initialValues: {
      catched_at: DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(
        LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES)
      ),
      place: {
        isValid: true,
        latitude: 35.65809922 as number | undefined,
        longitude: 139.74135747 as number | undefined,
      },
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
        id: values.catched_at,
        catched_at: values.catched_at,
        place: {
          latitude: values.place.latitude,
          longitude: values.place.longitude,
        },
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
          isValid: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    });
  }, []);
  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup>
        <Label for="catched_at">日時</Label>
        <Input
          id="catched_at"
          name="catched_at"
          placeholder=""
          type="datetime-local"
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
          value={formik.values.catched_at}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </FormGroup>
      <PlaceInput
        value={{
          isValid: true,
          latitude: formik.values.place.latitude,
          longitude: formik.values.place.longitude,
        }}
        onChange={(value) => {
          if (value.isValid) {
            formik.setValues({ ...formik.values, place: value });
          }
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
      <Row>
        <Col md="3">
          <FormGroup>
            <Label for="method_type">仕掛け</Label>
            <Input id="method_type" name="method.type" type="select">
              <option value="">選択してください</option>
              <option value="徒手">徒手</option>
              <option value="刺突">刺突</option>
              <option value="網">網</option>
              <option value="釣">釣</option>
              <option value="その他">その他</option>
            </Input>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Label for="method_details">備考</Label>
            <Input
              id="method_details"
              name="method.details"
              placeholder="仕掛けの詳細を記載"
              type="text"
            />
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateCatchForm;
