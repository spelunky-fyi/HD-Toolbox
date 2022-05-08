pub static ALL_LABELS: &[Label] = &[
    Label::NoTeleporter,
    Label::Haunted,
    Label::Max,
    Label::Low,
    Label::No,
    Label::NoGold,
    Label::Pacifist,
    Label::Any,
    Label::Hell,
    Label::Shield,
    Label::Eggplant,
    Label::BigMoney,
    Label::JumboMoney,
    Label::Tutorial,
    Label::TempleShortcut,
    Label::MaxIceCavesShortcut,
    Label::Invalid,
];

pub enum Label {
    NoTeleporter,
    Haunted,
    Max,
    Low,
    No,
    NoGold,
    Pacifist,
    Any,
    Hell,
    Shield,
    Eggplant,
    BigMoney,
    JumboMoney,
    Tutorial,
    TempleShortcut,
    MaxIceCavesShortcut,
    Invalid,
}

impl Label {
    pub fn name(&self) -> String {
        match self {
            Label::NoTeleporter => "No Teleporter".into(),
            Label::Haunted => "Haunted".into(),
            Label::Max => "Max".into(),
            Label::Low => "Low".into(),
            Label::No => "No".into(),
            Label::NoGold => "No Gold".into(),
            Label::Pacifist => "Pacifist".into(),
            Label::Any => "Any".into(),
            Label::Hell => "Hell".into(),
            Label::Shield => "Shield Run".into(),
            Label::Eggplant => "Eggplant".into(),
            Label::BigMoney => "Big Money".into(),
            Label::JumboMoney => "Jumbo Money".into(),
            Label::Tutorial => "Tutorial".into(),
            Label::TempleShortcut => "Temple Shortcut".into(),
            Label::MaxIceCavesShortcut => "Max Ice Caves Shortcut".into(),
            Label::Invalid => "No Known Valid Run".into(),
        }
    }

    pub fn percent_priority(&self) -> Option<u8> {
        match self {
            Label::NoTeleporter => None,
            Label::Haunted => None,
            Label::Max => None,
            Label::Low => Some(2),
            Label::No => Some(2),
            Label::NoGold => None,
            Label::Pacifist => None,
            Label::Any => Some(1),
            Label::Hell => Some(1),
            Label::Shield => None,
            Label::Eggplant => Some(1),
            Label::BigMoney => Some(0),
            Label::JumboMoney => Some(0),
            Label::Tutorial => Some(0),
            Label::TempleShortcut => Some(0),
            Label::MaxIceCavesShortcut => Some(0),
            Label::Invalid => None,
        }
    }

    pub fn is_exclusive(&self) -> bool {
        match self {
            Label::BigMoney
            | Label::JumboMoney
            | Label::Tutorial
            | Label::TempleShortcut
            | Label::MaxIceCavesShortcut
            | Label::Invalid => true,
            _ => false,
        }
    }
}
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
