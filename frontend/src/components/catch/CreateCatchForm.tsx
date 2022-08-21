import { ChronoUnit, DateTimeFormatter, LocalDateTime } from "@js-joda/core";
import { useFormik } from "formik";
import { useEffect } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
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
      place_latitude: "",
      place_longitude: "",
      fish_species: "",
      method_type: "",
      method_details: "",
    },
    onSubmit: (values) =>
      onSubmit({
        id: values.catched_at,
        catched_at: values.catched_at,
        place: {
          latitude: values.place_latitude,
          longitude: values.place_longitude,
        },
        fish: {
          species: values.fish_species,
        },
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
        place_latitude:
          position.coords.latitude > 0
            ? position.coords.latitude + "N"
            : position.coords.latitude + "S",
        place_longitude:
          position.coords.longitude > 0
            ? position.coords.longitude + "E"
            : position.coords.longitude + "W",
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
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="place_latitude">緯度</Label>
            <Input
              id="place_latitude"
              name="place_latitude"
              placeholder="35.65809922N"
              type="text"
              value={formik.values.place_latitude}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="place_longitude">経度</Label>
            <Input
              id="place_longitude"
              name="place_longitude"
              placeholder="139.74135747E"
              type="text"
              value={formik.values.place_longitude}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <Label for="fish_species">魚種</Label>
        <Input
          id="fish_species"
          name="fish.species"
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
