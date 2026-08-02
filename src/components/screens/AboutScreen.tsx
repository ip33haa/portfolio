import { JZL_SITE_URL } from "../../data/jzlSite";
import { EmbeddedSiteFrame } from "./EmbeddedSiteFrame";

export function AboutScreen() {
  return <EmbeddedSiteFrame title="About Me" src={JZL_SITE_URL} />;
}
