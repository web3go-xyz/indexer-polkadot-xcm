export class ParachainConstants {
  static SECTION_AUTOMATION_TIME: string = "automationTime";
  static SECTION_AUTOMATION_PREFIX: string = "automation";

  //the flag to filter the match extrinsics and events
  static FilterOnlyAutomationTimeSection: boolean = true;

  static isAutomationTime(section: string) {
    return section.toUpperCase().indexOf(ParachainConstants.SECTION_AUTOMATION_PREFIX.toUpperCase()) > -1;
  }
}
