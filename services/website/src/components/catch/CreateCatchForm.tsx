import { ChronoUnit, LocalDateTime, ZoneId } from "@js-joda/core";
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
import { Catch } from "./models";

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
      fishes_sizeText: [""],
      fishes_count: [""],
      method_type: "",
      method_details: "",
    },
    onSubmit: (values) =>
      onSubmit({
        catched_at: values
          .catched_at!.atZone(ZoneId.SYSTEM)
          .toInstant()
          .toString(),
        place: values.place,
        fishes: values.fishes_species
          .filter((value) => !value)
          .map((value, i) => ({
            species: value,
            sizeText: !values.fishes_sizeText
              ? undefined
              : values.fishes_sizeText[i],
            count: 1,
          })),
        method: {
          type: values.method_type,
          details: !values.method_details ? undefined : values.method_details,
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
          placeholder="例) オオモンハタ"
          type="text"
          value={formik.values.fishes_species[0]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </FormGroup>
      <FormGroup>
        <Label for="fishes_sizeText0">サイズ</Label>
        <Input
          id="fishes_sizeText0"
          name="fishes_sizeText[0]"
          placeholder="例) 50cm"
          type="text"
          value={formik.values.fishes_sizeText[0]}
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
      <Button type="submit" color="primary" block>
        登録
      </Button>
    </Form>
  );
};

export default function ({ onSuccess }: { onSuccess: () => void }) {
  return (
    <CreateCatchForm
      onSubmit={async (value) => {
        try {
          const result = await fetch(
            import.meta.env.VITE_API_URL + "/catches",
            {
              method: "POST",
              body: JSON.stringify(value),
            }
          );
          if (result.ok) {
            alert("登録しました。");
            onSuccess();
          } else {
            alert("登録できませんでした。");
          }
        } catch (e) {
          alert(e);
        }
      }}
    />
  );
}
