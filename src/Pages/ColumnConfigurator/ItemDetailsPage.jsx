import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Button } from "react-bootstrap";

import ListItem from "../../components/ListItem/ListItem";
import AccordianComp from "../../components/AccordionComp/AccordianComp";
import data from "../../mock/data.json";
import KitListItem from "../SpareParts/KitListItem";

function ItemDetailsPage(props) {
  const { partNumber } = useParams();
  console.log(partNumber);

  const { kitName } = useParams();
  console.log(kitName);

  const [kitItems, setKitItems] = useState([]);

  //
  useEffect(() => {
    const fetchPart = async () => {
      //setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5034/v1/spareparts/api/spareparts/getKitItems?partNumber=${partNumber}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((parsedJSON) => {
            setKitItems(parsedJSON.result);
          });
      } catch (e) {
        //setError(e)
      } finally {
        //setIsLoading(false);
      }
    };
    fetchPart();
  }, []);

  return (
    <Row style={{ marginTop: "45px" }}>
      <Col md={10} style={{ marginLeft: "1px", overflow: "auto" }}>
        <h4>{kitName}</h4>
        <br />
        <div className="d-flex">
          <h6>{partNumber}</h6>
        </div>

        <Col>
          <div
            style={{
              marginTop: "30px",
              width: "100%",
            }}
          >
            {/* <AccordianComp
              name={item.item_name}
              image={item.image}
              price={item.price}
              obj={item.part_references}
            /> */}
            {/* <Col xs={12} style={{ alignItems: "flex-end" }}>
              <Button
                style={{ marginRight: "auto" }}
                className="primary-btn col-xs-11 text-left"
              >
                Filter Parts <FilterListIcon />
              </Button>
            </Col> */}

            <Col style={{ height: '700px' ,overflow: 'auto'}}>
              {kitItems?.map((item) => {
                return (
                  <KitListItem
                    name={item.description}
                    partNumber={item.partNumber}
                    // image={item.image}
                    // price={item.price}
                    // obj={item.part_references}
                  />
                );
              })}
            </Col>
            {/* <ListItem
              // name={item.item_name}
              // image={item.image}
              // price={item.price}
              // obj={item.part_references}
            /> */}
          </div>
        </Col>
      </Col>
    </Row>
  );
}
export default ItemDetailsPage;
