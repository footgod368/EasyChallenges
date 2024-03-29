module Level3.Level3Init exposing (init)

{-| Init of Level3 Model.


# init

@docs init

-}

import Array
import Browser.Dom exposing (getViewport)
import GlobalFunction.GlobalBasics as GlobalBasics
import Level3.Level3Type as Level3Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event
import Modules.GameControl as GameControl
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Modules.SavePoint as SavePoint
import Modules.Sound as Sound
import Task


{-| `init` of Level3 Model, see in level1Init, highly repetition
-}
init : () -> ( Level3Type.Model, Cmd MainType.Msg )
init a =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 54 * 40, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.hitLineSeg 1 "A" (GlobalBasics.blockPosFloat ( 2, 12.1 )) (GlobalBasics.blockPosFloat ( 3, 12.1 ))
                    , Event.hitLineSeg 2 "B" (GlobalBasics.blockPosFloat ( 4, 12.1 )) (GlobalBasics.blockPosFloat ( 5, 12.1 ))
                    , Event.hitLineSeg 3 "C" (GlobalBasics.blockPosFloat ( 6, 12.1 )) (GlobalBasics.blockPosFloat ( 7, 12.1 ))
                    , Event.hitLineSeg 4 "D" (GlobalBasics.blockPosFloat ( 8, 12.1 )) (GlobalBasics.blockPosFloat ( 9, 12.1 ))
                    , Event.hitLineSeg 5 "first falling ground" (GlobalBasics.blockPosFloat ( 12.7, 1 )) (GlobalBasics.blockPosFloat ( 12.7, 15 ))
                    , Event.hitLineSeg 6 "first sword" (GlobalBasics.blockPosFloat ( 14, 1 )) (GlobalBasics.blockPosFloat ( 14, 14 ))
                    ]
            , boundary = Boundary.normalInit
            , playerAtLastSavePoint = Player.init ( 50.0, 490.0 ) Player.defPlayerProperty Player.NoNextPropertyChange
            , player = Player.init ( 50.0, 490.0 ) Player.defPlayerProperty Player.NoNextPropertyChange
            , bricks =
                Array.fromList
                    (List.concat
                        [ Brick.initRow 15 1 12
                        , Brick.initRow 15 17 54
                        , [ NoticeBoard.boundary ( 2, 4.2 ) ( 7, 5.2 ) ]
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 2, 11 )) ( 40, 40 ) "#FFFF00"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 4, 11 )) ( 40, 40 ) "#FFFF00"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 6, 11 )) ( 40, 40 ) "#FFFF00"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 8, 11 )) ( 40, 40 ) "#FFFF00"
                          ]
                        , Brick.initFallingRow 15 13 16 5
                        , [ NoticeBoard.boundary ( 46, 8 ) ( 6.5, 4 ) ]
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 14 ))
                    ]
            , endPoint = EndPoint.initDetailed (GlobalBasics.blockPosFloat ( 47, 10.5 )) ( 5 * 40, 1 * 40 )
            , noticeBoards =
                Array.fromList
                    [ NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 5.5, 5 )) "Which game studio do you" 20
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 3.8, 5.8 )) "think is best?" 20
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 4.5, 6.6 )) "A. Ubisoft （育碧）" 20
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 4.6, 7.4 )) "B. Rockstar （R星）" 20
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 4.5, 8.2 )) "C. Paradox （P社）" 20
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 5.1, 9.0 )) "D. Electronic Arts（EA）" 20
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 2.5, 11.8 )) "A" 35
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 4.5, 11.8 )) "B" 35
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 6.5, 11.8 )) "C" 35
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 8.5, 11.8 )) "D" 35
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 49.2, 8.6 )) "Thanks for support!" 25
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 49.2, 9.4 )) "\"Easy Challenges\" is" 25
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 48, 10.2 )) "created by:" 25
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 49.2, 11.3 )) "Silver Dog" 30
                    ]
            , needles =
                Array.fromList
                    (List.concat
                        [ [ Needle.initHidden ( 2, 12 ) 1 Needle.Downwards ]
                        , [ Needle.initHidden ( 4, 12 ) 2 Needle.Downwards ]
                        , [ Needle.initHidden ( 6, 12 ) 3 Needle.Downwards ]
                        , [ Needle.initHidden ( 8, 12 ) 4 Needle.Downwards ]
                        , [ Needle.sword ( 14, 16 ) ( 14, -3 ) ( 2, 3 ) 8.0 6 Needle.BombUp ]
                        ]
                    )
            , keyPressed = []
            , gameControl = GameControl.init MainType.Level4 [ [ "Go right and then hit \"Silver Dog\"" ] ]
            , sound =
                Sound.init
                    [ Sound.Event 6 Sound.Sword
                    ]
            , mainScene = MainType.Level3
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
