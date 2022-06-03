use std::{cmp::Reverse, collections::HashSet, hash::Hash};

#[derive(Debug, Hash, PartialEq, Eq, Clone)]
pub enum LabelType {
    Label(Label),
    TerminusLabel(TerminusLabel),
    // Unused for actual labels.
    Default,
}

impl LabelType {
    pub fn to_label_metadata(&self) -> LabelMetadata {
        match self {
            LabelType::Label(label) => label.to_label_metadata(),
            LabelType::TerminusLabel(label) => label.to_label_metadata(),
            LabelType::Default => LabelMetadata::default(),
        }
    }
}

#[derive(Debug, Hash, PartialEq, Eq, Clone)]
pub struct LabelMetadata {
    pub name: &'static str,
    pub hide_early: bool,
    pub add_ok: bool,
    pub name_priority: u8,
    pub alt_name_priority: Option<u8>,
    pub percent_priority: Option<u8>,
    pub label_type: LabelType,
}

impl Default for LabelMetadata {
    fn default() -> Self {
        Self {
            name: "DEFAULT",
            name_priority: 0,
            alt_name_priority: None,
            hide_early: false,
            add_ok: false,
            percent_priority: None,
            label_type: LabelType::Default,
        }
    }
}

#[derive(Debug, Hash, PartialEq, Eq, Clone)]
pub enum Label {
    NoTeleporter,
    Haunted,
    Max,
    Low,
    No,
    NoGold,
    Pacifist,
    Shield,
    Eggplant,
}

impl Label {
    pub fn default_labels() -> HashSet<Label> {
        let mut labels = HashSet::new();
        labels.insert(Label::NoTeleporter);
        labels.insert(Label::No);
        labels.insert(Label::Low);
        labels.insert(Label::NoGold);
        labels.insert(Label::Pacifist);
        labels
    }

    pub fn to_label_metadata(&self) -> LabelMetadata {
        match self {
            Label::NoTeleporter => LabelMetadata {
                name: "No Teleporter",
                label_type: LabelType::Label(Label::NoTeleporter),
                name_priority: 7,
                ..Default::default()
            },
            Label::Haunted => LabelMetadata {
                name: "Haunted",
                label_type: LabelType::Label(Label::Haunted),
                name_priority: 6,
                add_ok: true,
                ..Default::default()
            },
            Label::Max => LabelMetadata {
                name: "Max",
                label_type: LabelType::Label(Label::Max),
                name_priority: 5,
                add_ok: true,
                ..Default::default()
            },
            Label::Low => LabelMetadata {
                name: "Low",
                label_type: LabelType::Label(Label::Low),
                name_priority: 4,
                alt_name_priority: Some(1),
                percent_priority: Some(2),
                ..Default::default()
            },
            Label::No => LabelMetadata {
                name: "No",
                label_type: LabelType::Label(Label::No),
                name_priority: 4,
                alt_name_priority: Some(1),
                hide_early: true,
                percent_priority: Some(2),
                ..Default::default()
            },
            Label::NoGold => LabelMetadata {
                name: "No Gold",
                label_type: LabelType::Label(Label::NoGold),
                name_priority: 3,
                hide_early: true,
                ..Default::default()
            },
            Label::Pacifist => LabelMetadata {
                name: "Pacifist",
                label_type: LabelType::Label(Label::Pacifist),
                name_priority: 2,
                hide_early: true,
                ..Default::default()
            },
            Label::Shield => LabelMetadata {
                name: "Shield Run",
                label_type: LabelType::Label(Label::Shield),
                add_ok: true,
                ..Default::default()
            },
            Label::Eggplant => LabelMetadata {
                name: "Eggplant",
                label_type: LabelType::Label(Label::Eggplant),
                add_ok: true,
                percent_priority: Some(1),
                ..Default::default()
            },
        }
    }
}

#[derive(Debug, Hash, PartialEq, Eq, Clone)]
pub enum TerminusLabel {
    Any,
    Hell,
    TempleShortcut,
    MaxIceCavesShortcut,
    BigMoney,
    JumboMoney,
    Death,
    Invalid,
}

impl TerminusLabel {
    pub fn to_label_metadata(&self) -> LabelMetadata {
        match self {
            TerminusLabel::Any => LabelMetadata {
                name: "Any",
                label_type: LabelType::TerminusLabel(TerminusLabel::Any),
                percent_priority: Some(1),
                ..Default::default()
            },
            TerminusLabel::Hell => LabelMetadata {
                name: "Hell",
                label_type: LabelType::TerminusLabel(TerminusLabel::Hell),
                percent_priority: Some(1),
                ..Default::default()
            },
            TerminusLabel::TempleShortcut => LabelMetadata {
                name: "Temple Shortcut",
                label_type: LabelType::TerminusLabel(TerminusLabel::TempleShortcut),
                percent_priority: Some(0),
                ..Default::default()
            },
            TerminusLabel::MaxIceCavesShortcut => LabelMetadata {
                name: "Max Ice Caves Shortcut",
                label_type: LabelType::TerminusLabel(TerminusLabel::MaxIceCavesShortcut),
                percent_priority: Some(0),
                ..Default::default()
            },
            TerminusLabel::BigMoney => LabelMetadata {
                name: "Big Money",
                label_type: LabelType::TerminusLabel(TerminusLabel::BigMoney),
                percent_priority: Some(0),
                ..Default::default()
            },
            TerminusLabel::JumboMoney => LabelMetadata {
                name: "Jumbo Money",
                label_type: LabelType::TerminusLabel(TerminusLabel::JumboMoney),
                percent_priority: Some(0),
                ..Default::default()
            },
            TerminusLabel::Death => LabelMetadata {
                name: "Death",
                percent_priority: Some(0),
                label_type: LabelType::TerminusLabel(TerminusLabel::Death),
                ..Default::default()
            },
            TerminusLabel::Invalid => LabelMetadata {
                name: "No Known Valid Run",
                label_type: LabelType::TerminusLabel(TerminusLabel::Invalid),
                ..Default::default()
            },
        }
    }
}

#[derive(Debug, PartialEq, Eq)]
struct LabelCache {
    text: String,
    hide_early: bool,
    alt_names: bool,
    exclude_labels: HashSet<LabelType>,
}

#[derive(Debug)]
pub struct RunLabels {
    labels: HashSet<Label>,
    terminus: TerminusLabel,

    label_cache: Option<LabelCache>,
}

impl RunLabels {
    pub fn new(labels: HashSet<Label>, terminus: TerminusLabel) -> Self {
        Self {
            labels,
            terminus,
            label_cache: None,
        }
    }

    pub fn new_temple_shortcut() -> Self {
        Self::new(Label::default_labels(), TerminusLabel::TempleShortcut)
    }

    pub fn new_max_ics() -> Self {
        let mut labels = Label::default_labels();
        labels.insert(Label::Max);
        Self::new(labels, TerminusLabel::MaxIceCavesShortcut)
    }

    pub fn set_terminus(&mut self, terminus: TerminusLabel) {
        if terminus == self.terminus {
            return;
        }
        self.terminus = terminus;
        self.label_cache = None;
    }

    pub fn get_terminus(&self) -> &TerminusLabel {
        return &self.terminus;
    }

    pub fn add_label(&mut self, label: Label) {
        if self.labels.insert(label) {
            self.label_cache = None;
        }
    }

    pub fn rm_label(&mut self, label: &Label) {
        if self.labels.remove(label) {
            self.label_cache = None;
        }
    }

    pub fn terminus_requires_low(&self) -> bool {
        [
            TerminusLabel::TempleShortcut,
            TerminusLabel::MaxIceCavesShortcut,
        ]
        .contains(&self.terminus)
    }

    fn get_percent(
        &self,
        metadatas: &Vec<LabelMetadata>,
        visible: &HashSet<LabelType>,
    ) -> Option<LabelType> {
        let mut found = None;

        for candidate in metadatas {
            if !visible.contains(&candidate.label_type) {
                continue;
            }

            let priorty = match candidate.percent_priority {
                None => continue,
                Some(priority) => priority,
            };

            match found {
                None => found = Some(candidate.clone()),
                Some(ref metadata) => {
                    if priorty > metadata.percent_priority.unwrap_or(0) {
                        found = Some(candidate.clone())
                    }
                }
            }
        }

        found.map(|metadata| metadata.label_type)
    }

    fn get_visible(
        &self,
        metadatas: &Vec<LabelMetadata>,
        hide_early: bool,
        exclude_labels: &HashSet<LabelType>,
    ) -> HashSet<LabelType> {
        // Most Terminus Labels result in only showing themselves
        match self.terminus {
            TerminusLabel::TempleShortcut
            | TerminusLabel::MaxIceCavesShortcut
            | TerminusLabel::BigMoney
            | TerminusLabel::JumboMoney
            | TerminusLabel::Death
            | TerminusLabel::Invalid => {
                let mut visible = HashSet::with_capacity(1);
                visible.insert(LabelType::TerminusLabel(self.terminus.clone()));
                return visible;
            }
            _ => {}
        }

        let mut visible = HashSet::with_capacity(metadatas.len());
        for label_metadata in metadatas {
            if exclude_labels.contains(&label_metadata.label_type) {
                continue;
            }

            if hide_early && label_metadata.hide_early {
                continue;
            }
            visible.insert(label_metadata.label_type.clone());
        }

        let mut num_vis = visible.len();
        let mut current_loop = 0;
        let max_loops = 5;

        loop {
            for label_metadata in metadatas {
                match &label_metadata.label_type {
                    LabelType::Label(label) => match label {
                        Label::NoGold => {
                            if visible.contains(&LabelType::Label(Label::No)) {
                                visible.remove(&label_metadata.label_type);
                            }
                        }
                        Label::NoTeleporter => {
                            if visible.contains(&LabelType::Label(Label::Low)) {
                                visible.remove(&label_metadata.label_type);
                            }
                            if visible.contains(&LabelType::Label(Label::No)) {
                                visible.remove(&label_metadata.label_type);
                            }
                            if visible.contains(&LabelType::Label(Label::Eggplant)) {
                                visible.remove(&label_metadata.label_type);
                            }
                            if visible.contains(&LabelType::Label(Label::Shield)) {
                                visible.remove(&label_metadata.label_type);
                            }
                            if visible.contains(&LabelType::Label(Label::Pacifist)) {
                                visible.remove(&label_metadata.label_type);
                            }
                        }
                        Label::Low => {
                            if visible.contains(&LabelType::Label(Label::No)) {
                                visible.remove(&label_metadata.label_type);
                            }
                        }
                        Label::Haunted => {
                            if !visible.contains(&LabelType::Label(Label::Max)) {
                                visible.remove(&label_metadata.label_type);
                            }
                            if visible.contains(&LabelType::Label(Label::Shield)) {
                                visible.remove(&label_metadata.label_type);
                            }
                        }
                        _ => {}
                    },
                    LabelType::TerminusLabel(terminus) => match terminus {
                        TerminusLabel::Hell => {
                            if visible.contains(&LabelType::Label(Label::Eggplant)) {
                                visible.remove(&label_metadata.label_type);
                            }
                            if visible.contains(&LabelType::Label(Label::Shield)) {
                                visible.remove(&label_metadata.label_type);
                            }
                        }
                        TerminusLabel::Any => {
                            // Only elide Any when No Gold is the only label
                            if visible.contains(&LabelType::Label(Label::NoGold))
                                && self.labels.len() == 1
                            {
                                visible.remove(&label_metadata.label_type);
                            }
                            if visible.contains(&LabelType::Label(Label::Low)) {
                                visible.remove(&label_metadata.label_type);
                            }
                            if visible.contains(&LabelType::Label(Label::No)) {
                                visible.remove(&label_metadata.label_type);
                            }
                            if visible.contains(&LabelType::Label(Label::Eggplant)) {
                                visible.remove(&label_metadata.label_type);
                            }
                        }
                        _ => {}
                    },
                    _ => {}
                };
            }

            if visible.len() == num_vis || visible.is_empty() || current_loop >= max_loops {
                break;
            }
            num_vis = visible.len();
            current_loop += 1;
        }

        visible
    }

    pub fn get_text(
        &mut self,
        hide_early: bool,
        exclude_labels: &HashSet<LabelType>,
        alt_names: bool,
    ) -> String {
        if let Some(label_cache) = &self.label_cache {
            if label_cache.hide_early == hide_early
                && label_cache.exclude_labels == *exclude_labels
                && label_cache.alt_names == alt_names
            {
                return label_cache.text.clone();
            }
        }

        let metadatas = self.get_combined(alt_names);
        let visible_labels = self.get_visible(&metadatas, hide_early, &exclude_labels);
        let percent_label = self.get_percent(&metadatas, &visible_labels);

        let mut parts = vec![];

        for candidate in metadatas {
            if !visible_labels.contains(&candidate.label_type) {
                continue;
            }

            if Some(candidate.label_type) == percent_label {
                parts.push(format!("{}%", candidate.name));
            } else {
                parts.push(format!("{}", candidate.name));
            }
        }

        let text = parts.join(" ");
        self.label_cache = Some(LabelCache {
            text: text.clone(),
            hide_early,
            exclude_labels: exclude_labels.clone(),
            alt_names,
        });

        text
    }

    fn get_combined(&self, alt_names: bool) -> Vec<LabelMetadata> {
        let mut combined: Vec<LabelMetadata> = Vec::with_capacity(&self.labels.len() + 1);

        for label in &self.labels {
            combined.push(label.to_label_metadata());
        }
        combined.push(self.terminus.to_label_metadata());

        combined.sort_unstable_by_key(|metadata| {
            let priority = if alt_names {
                match metadata.alt_name_priority {
                    Some(priority) => priority,
                    None => metadata.name_priority,
                }
            } else {
                metadata.name_priority
            };
            Reverse(priority)
        });
        return combined;
    }
}

impl Default for RunLabels {
    fn default() -> Self {
        Self::new(Label::default_labels(), TerminusLabel::Any)
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashSet;

    use crate::{Label, LabelType, RunLabels, TerminusLabel};

    #[test]
    fn test_non_standard_terminus() {
        let exclude_labels = HashSet::new();

        let mut labels = RunLabels::new_temple_shortcut();
        assert_eq!(
            labels.get_text(true, &exclude_labels, false),
            String::from("Temple Shortcut%")
        );

        let mut labels = RunLabels::new_max_ics();
        assert_eq!(
            labels.get_text(true, &exclude_labels, false),
            String::from("Max Ice Caves Shortcut%")
        );
    }

    #[test]
    fn test_standard_run() {
        let mut exclude_labels = HashSet::new();

        let mut labels = RunLabels::default();
        assert_eq!(
            labels.get_text(true, &exclude_labels, false),
            String::from("Low%")
        );

        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("No% Pacifist")
        );
        assert_eq!(
            labels.get_text(false, &exclude_labels, true),
            String::from("Pacifist No%")
        );
        exclude_labels.insert(crate::LabelType::Label(Label::Pacifist));
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("No%")
        );

        labels.rm_label(&Label::No);
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Low% No Gold")
        );
        assert_eq!(
            labels.get_text(false, &exclude_labels, true),
            String::from("No Gold Low%")
        );
        assert_eq!(
            labels.get_text(true, &exclude_labels, false),
            String::from("Low%")
        );

        exclude_labels = HashSet::new();
        exclude_labels.insert(LabelType::Label(Label::No));
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Low% No Gold Pacifist")
        );
        assert_eq!(
            labels.get_text(false, &exclude_labels, true),
            String::from("No Gold Pacifist Low%")
        );
    }

    #[test]
    fn test_haunted() {
        let exclude_labels = HashSet::new();

        let mut labels = RunLabels::default();
        labels.rm_label(&Label::No);
        labels.rm_label(&Label::Pacifist);
        labels.rm_label(&Label::NoGold);
        labels.add_label(Label::Haunted);

        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Low%")
        );

        labels.add_label(Label::Max);
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Haunted Max Low%")
        );

        labels.add_label(Label::Shield);
        labels.set_terminus(TerminusLabel::Hell);
        labels.rm_label(&Label::Low);
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Max Shield Run")
        );
    }

    #[test]
    fn test_most_visible() {
        let exclude_labels = HashSet::new();

        let mut labels = RunLabels::default();
        labels.add_label(Label::Haunted);
        labels.add_label(Label::Max);
        labels.rm_label(&Label::No);
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Haunted Max Low% No Gold Pacifist")
        );

        labels.set_terminus(TerminusLabel::Hell);
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Haunted Max Low% No Gold Pacifist Hell")
        );

        labels.add_label(Label::Eggplant);
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Haunted Max Low% No Gold Pacifist Eggplant")
        );

        labels.add_label(Label::Shield);
        labels.rm_label(&Label::Eggplant);
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Max Low% No Gold Pacifist Shield Run")
        );

        labels.rm_label(&Label::Low);
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Max No Gold Pacifist Shield Run")
        );

        labels.rm_label(&Label::Shield);
        labels.add_label(Label::Eggplant);
        assert_eq!(
            labels.get_text(false, &exclude_labels, false),
            String::from("Haunted Max No Gold Pacifist Eggplant%")
        );
    }
}
