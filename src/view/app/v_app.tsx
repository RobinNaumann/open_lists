import { Edit2, Sparkles } from "lucide-react";
import { Card, Spaced } from "../../elbe/components";
import { go } from "../../util";
import { ArchiveBtn } from "../membership/v_member_approve_list";

export function LinkView({
  description,
  link,
}: {
  description: string;
  link?: string;
}) {
  return (
    <div class="column cross-stretch gap-half">
      <div class="text-s">{description}</div>
      {link ? (
        <a class="b" href={link}>
          {link}
        </a>
      ) : (
        <span class="b i">no link provi.ded</span>
      )}
    </div>
  );
}
