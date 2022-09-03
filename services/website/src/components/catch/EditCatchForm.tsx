import { ChronoUnit, Instant, LocalDateTime, ZoneId } from "@js-joda/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Fragment, useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { DateTimeInput } from "../inputs/DateTimeInput";
import { PlaceInput } from "../inputs/PlaceInput";
import { Catch } from "./models";

type EditCatchFormProps = {
  data: Catch;
  onSubmit: (value: Partial<Catch>) => void;
};

export const EditCatchForm = ({ data, onSubmit }: EditCatchFormProps) => {
  const formik = useFormik({
    initialValues: {
      catched_at: LocalDateTime.from(
        Instant.parse(data.catched_at).atZone(ZoneId.SYSTEM)
      ) as LocalDateTime | null | undefined,
      place: data.place as
        | {
            latitude: number;
            longitude: number;
          }
        | null
        | undefined,
      fishes_species: data.fishes.map((fish) => fish.species),
      fishes_sizeText: data.fishes.map((fish) => fish.sizeText || ""),
      fishes_count: data.fishes.map((fish) => fish.count),
      method_type: data.method.type,
      method_details: data.method.details || "",
    },
    validationSchema: Yup.object({
      catched_at: Yup.object()
        .nullable()
        .test("null-check", "不正な値です。", (value) => value !== null)
        .required("必ず入力してください。"),
      fishes_species: Yup.array()
        .of(Yup.string().required("必ず入力してください。"))
        .min(1, "Must be less than 1")
        .required("必ず入力してください。"),
      method_type: Yup.string().required("必ず入力してください。"),
    }),
    onSubmit: (values) => {
      onSubmit({
        ...data,
        id: data.id,
        catched_at: values
          .catched_at!.atZone(ZoneId.SYSTEM)
          .toInstant()
          .toString(),
        place: values.place,
        fishes: values.fishes_species
          .filter((value) => !!value)
          .map((value, i) => ({
            species: value,
            sizeText: values.fishes_sizeText[i] || undefined,
            count: Number(values.fishes_count[i] || undefined),
          })),
        method: {
          type: values.method_type,
          details: !values.method_details ? undefined : values.method_details,
        },
      } as Catch);
    },
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
        <DateTimeInput
          id="catched_at"
          value={formik.values.catched_at}
          onChange={(value) =>
            formik.setValues({ ...formik.values, catched_at: value })
          }
          invalid={!!formik.errors.catched_at}
        />
        {formik.errors.catched_at && (
          <FormFeedback className="d-block">
            {formik.errors.catched_at}
          </FormFeedback>
        )}
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
          invalid={
            !!formik.errors.fishes_species &&
            !!formik.errors.fishes_species[0] &&
            !!formik.touched.fishes_species &&
            (formik.touched.fishes_species as any)[0]
          }
        />
        {formik.errors.fishes_species &&
          formik.errors.fishes_species[0] &&
          formik.touched.fishes_species &&
          (formik.touched.fishes_species as any)[0] && (
            <FormFeedback>{formik.errors.fishes_species[0]}</FormFeedback>
          )}
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
                    invalid={!!formik.errors.method_type}
                    checked={formik.values.method_type === item}
                  />
                  <Label
                    for={"method_type" + i}
                    className={
                      formik.errors.method_type && formik.touched.method_type
                        ? "btn btn-outline-danger"
                        : "btn btn-outline-primary"
                    }
                  >
                    {item}
                  </Label>
                </Fragment>
              );
            })}
          </ButtonGroup>
          {formik.errors.method_type && formik.touched.method_type && (
            <FormFeedback className="d-block">
              {formik.errors.method_type}
            </FormFeedback>
          )}
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

export default function ({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess: (value: Catch) => void;
}) {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    (async () => {
      const result = await fetch(`/api/catches/${id}`, {
        method: "GET",
      });
      if (result.ok) {
        setData(await result.json());
      }
    })();
  }, []);
  if (data) {
    return (
      <EditCatchForm
        data={data}
        onSubmit={async (value) => {
          try {
            const result = await fetch(`/api/catches/${id}`, {
              method: "PUT",
              body: JSON.stringify(value),
            });
            if (result.ok) {
              onSuccess(await result.json());
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
  return <div>Loading...</div>;
}
